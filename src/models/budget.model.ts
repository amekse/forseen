import { getBudgetList, setBudgetList } from "../services/localStoring.service";
import { BudgetForMonth, BudgetList, BudgetWithAdjustment } from "../types/budget.type";
import { ErrorMessages, Months } from "../types/common.types";
import { logError } from "../utils/logger.utils";
import generalProjectedMonthList from "./generalProjectedMonthList.model";

class BudgetData {
    static #instance: BudgetData;
    #budgetList:BudgetList = [];
    #errorList:ErrorMessages = false;
    private constructor() {}

    public static get instance(): BudgetData {
        if (!BudgetData.#instance) {
            BudgetData.#instance = new BudgetData();
        }

        return BudgetData.#instance;
    }

    add(data:BudgetForMonth) {
        let errorList:ErrorMessages = [];
        const generalProjectionForMonth = generalProjectedMonthList.getMonth(data.month, data.year);
        let extraAmount = data.amount - generalProjectionForMonth.totalCost;
        let availableAdjustment = generalProjectionForMonth.totalCost - data.amount;
        let monthYear = (data.year*100)+data.month;
        if (data.amount >= 0) {
            this.#budgetList[monthYear] = {
                month: data.month,
                year: data.year,
                amount: data.amount,
                extraAmount: extraAmount  > 0 ? extraAmount : 0,
                adjustAmount: 0,
                availableAdjustment
            };
        } else {
            errorList.push('Budget amount cannot be lower than zero');
        }
        if (errorList.length > 0) {
            this.#errorList = errorList;
            logError('BudgetData addEachMonth', this.#errorList);
        }
        setBudgetList(this.#budgetList);
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
        this.#errorList = [];
        setBudgetList(this.#budgetList);
    }
}

const budgetData = BudgetData.instance;
export default budgetData;