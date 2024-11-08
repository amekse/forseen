import { getBudgetList, setBudgetList } from "../services/localStoring.service";
import { BudgetForMonth, BudgetForPeriod, BudgetList, BudgetWithAdjustment } from "../types/budget.type";
import { ErrorMessages, Months } from "../types/common.types";
import { GeneralProjectedForMonth } from "../types/generalProjected.types";
import { logError } from "../utils/logger.utils";
import generalProjectedMonthList from "./generalProjectedMonthList.model";

class BudgetData {
    static #instance: BudgetData;
    #budgetList:BudgetList = {
        totalExtraCost: 0
    };
    private constructor() {}

    public static get instance(): BudgetData {
        if (!BudgetData.#instance) {
            BudgetData.#instance = new BudgetData();
        }

        return BudgetData.#instance;
    }

    addForMonth(data:BudgetForMonth) {
        const generalProjectionForMonth = generalProjectedMonthList.getMonth(data.month, data.year);
        let extraAmount = generalProjectionForMonth.totalCost - data.amount;
        let availableAdjustment = data.amount - generalProjectionForMonth.totalCost;
        let monthYear = (data.year*100)+data.month;
        let exsistingExtraAmount = this.#budgetList[monthYear].extraAmount;
        this.#budgetList[monthYear] = {
            month: data.month,
            year: data.year,
            amount: data.amount,
            extraAmount: extraAmount >= 0 ? extraAmount : 0,
            adjustAmount: 0,
            availableAdjustment: availableAdjustment >= 0 ? availableAdjustment : 0
        };
        this.#budgetList.totalExtraCost -= exsistingExtraAmount;
        this.#budgetList.totalExtraCost += extraAmount >= 0 ? extraAmount : 0;
        setBudgetList(this.#budgetList);
    }

    addAverage(data:BudgetForPeriod) {
        let countMonthYear = (data.startYear*100)+data.startMonth;
        let endMonthYear = (data.endYear*100)+data.endMonth;

        while (countMonthYear <= endMonthYear) {
            let month = countMonthYear%100;
            let year = Math.trunc(countMonthYear/100);
            const generalProjectionForMonth = generalProjectedMonthList.getMonth(month as Months, year);
            let extraAmount = generalProjectionForMonth.totalCost - data.amount;
            let availableAdjustment = data.amount - generalProjectionForMonth.totalCost;
            this.#budgetList[countMonthYear] = {
                month: month as Months,
                year,
                amount: data.amount,
                extraAmount: extraAmount >= 0 ? extraAmount : 0,
                adjustAmount: 0,
                availableAdjustment: availableAdjustment >= 0 ? availableAdjustment : 0
            }
            this.#budgetList.totalExtraCost += extraAmount >= 0 ? extraAmount : 0;
            countMonthYear += 1;
        }
    }

    recalculateBudget(month: Months, year: number, generalProjectionForMonth: GeneralProjectedForMonth) {
        const monthYear = (year*100)+month;
        let data = this.getMonth(month, year);
        let extraAmount = generalProjectionForMonth.totalCost - data.amount;
        let availableAdjustment = data.amount - generalProjectionForMonth.totalCost;
        this.#budgetList[monthYear] = {
            ...this.getMonth(month, year),
            extraAmount: extraAmount >= 0 ? extraAmount : 0,
            availableAdjustment: availableAdjustment >= 0 ? availableAdjustment : 0
        }
        this.#budgetList.totalExtraCost += extraAmount >= 0 ? extraAmount : 0;
    }

    readFromLocalBudgetMonths():BudgetList {
        let data = getBudgetList();
        let savedProj:BudgetList = {
            totalExtraCost: 0
        };
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
        this.#budgetList = {
            totalExtraCost: 0
        };
        setBudgetList(this.#budgetList);
    }

    getTotalExtraAmount():number {
        return this.#budgetList.totalExtraCost;
    }

    setAdjustmentAmount(amount:number, monthYear:number, month:Months, year:number): ErrorMessages {
        if (this.#budgetList[monthYear]) {
            this.#budgetList[monthYear].adjustAmount = amount;
            return false;
        } else {
            return [`Please add budget for ${month} ${year}`];
        }
    }

}

const budgetData = BudgetData.instance;
export default budgetData;