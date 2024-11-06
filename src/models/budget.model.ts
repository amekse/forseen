import { getBudgetList, setBudgetList } from "../services/localStoring.service";
import { BudgetForMonth, BudgetForPeriod, BudgetList, BudgetWithAdjustment } from "../types/budget.type";
import { Months } from "../types/common.types";
import { logError } from "../utils/logger.utils";
import generalProjectedMonthList from "./generalProjectedMonthList.model";

class BudgetData {
    static #instance: BudgetData;
    #budgetList:BudgetList = [];
    private constructor() {}

    public static get instance(): BudgetData {
        if (!BudgetData.#instance) {
            BudgetData.#instance = new BudgetData();
        }

        return BudgetData.#instance;
    }

    addForMonth(data:BudgetForMonth) {
        const generalProjectionForMonth = generalProjectedMonthList.getMonth(data.month, data.year);
        let extraAmount = data.amount - generalProjectionForMonth.totalCost;
        let availableAdjustment = generalProjectionForMonth.totalCost - data.amount;
        let monthYear = (data.year*100)+data.month;
        this.#budgetList[monthYear] = {
            month: data.month,
            year: data.year,
            amount: data.amount,
            extraAmount: extraAmount  > 0 ? extraAmount : 0,
            adjustAmount: 0,
            availableAdjustment
        };
        setBudgetList(this.#budgetList);
    }

    addAverage(data:BudgetForPeriod) {
        let countMonthYear = (data.startYear*100)+data.startMonth;
        let endMonthYear = (data.endYear*100)+data.endMonth;

        while (countMonthYear <= endMonthYear) {
            let month = countMonthYear%100;
            let year = countMonthYear/100;
            const generalProjectionForMonth = generalProjectedMonthList.getMonth(month as Months, year);
            let extraAmount = data.amount - generalProjectionForMonth.totalCost;
            let availableAdjustment = generalProjectionForMonth.totalCost - data.amount;
            this.#budgetList[countMonthYear] = {
                month: month as Months,
                year,
                amount: data.amount,
                extraAmount: extraAmount  > 0 ? extraAmount : 0,
                adjustAmount: 0,
                availableAdjustment
            }
        }
    }

    readFromLocalBudgetMonths():BudgetList {
        let data = getBudgetList();
        let savedProj:BudgetList = {};
        let errorList = [];
        Object.keys(data).forEach(gpKey => {
            if (typeof gpKey === "number") {
                let innerData = data[gpKey];
                // TODO:  simplify the if condition in another function
                if (innerData.hasOwnProperty('amount') && typeof innerData.amount === "number" && innerData.hasOwnProperty('availableAdjustment') && typeof innerData.availableAdjustment === "number" && innerData.hasOwnProperty('adjustAmount') && typeof innerData.adjustAmount === "number" && innerData.hasOwnProperty('extraAmount') && typeof innerData.extraAmount === "number" && innerData.hasOwnProperty('month') && typeof innerData.month === "number" && innerData.hasOwnProperty('year') && typeof innerData.year === "number")  {
                    savedProj[gpKey] = innerData;
                } else {
                    errorList.push('Inner data missing');
                    logError("BudgetData readFromLocalBudgetMonths BudgetForMonth", errorList, innerData);
                }
            } else {
                errorList.push('list bad keys');
                logError("BudgetData readFromLocalBudgetMonths BudgetList", errorList, data[gpKey]);
            }
        });
        return savedProj;
    }

    getFull():BudgetList {
        return this.#budgetList;
    }

    getMonth(month:Months, year: number):BudgetWithAdjustment {
        let budgetForMonth:BudgetWithAdjustment = {
            month,
            year,
            amount: 0,
            extraAmount: 0,
            adjustAmount: 0,
            availableAdjustment: 0
        }
        const monthYear = (year*100)+month;
        if (generalProjectedMonthList.getMonth(month,year) !== undefined && this.#budgetList[monthYear] !== undefined) {
            return this.#budgetList[monthYear];
        } else {
            return budgetForMonth;
        }
    }

    clearAll() {
        this.#budgetList = [];
        setBudgetList(this.#budgetList);
    }
}

const budgetData = BudgetData.instance;
export default budgetData;