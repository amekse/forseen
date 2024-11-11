import { getBudgetList, setBudgetList } from "../services/localStoring.service";
import { AverageBudget, BudgetForMonth, BudgetList } from "../types/budget.type";
import { Months } from "../types/common.types";
import { logError } from "../services/logger.services";

class BudgetData {
    static #instance: BudgetData;
    #budgetList:BudgetList = this.readFromLocalBudgetMonths();
    
    private constructor() {}

    public static get instance(): BudgetData {
        if (!BudgetData.#instance) {
            BudgetData.#instance = new BudgetData();
        }

        return BudgetData.#instance;
    }

    addBudgetForMonthsList(budgetMonthsList: BudgetForMonth[]) {
        budgetMonthsList.forEach(budgetMonth => {
            let monthYear = (budgetMonth.year*100)+budgetMonth.month;
            this.#budgetList[monthYear] = budgetMonth;
        })
        setBudgetList(this.#budgetList);
    }

    addAverageBudgetForMonths(averageBudget:AverageBudget) {
        let countMonthYear = (averageBudget.startYear*100)+averageBudget.startMonth;
        const endMonthYear = (averageBudget.endYear*100)+averageBudget.endMonth;

        while(countMonthYear <= endMonthYear) {
            const curMonth = countMonthYear%100;
            let curYear = Math.trunc(countMonthYear/100);
            this.#budgetList[countMonthYear] = {
                month: curMonth as Months,
                year: curYear,
                amount: averageBudget.amount
            }

            if (curMonth === 12) {
                curYear += 1;
                countMonthYear = curYear*100 + 1;
            } else {
                countMonthYear += 1;
            }
        }
        setBudgetList(this.#budgetList);
    }

    getBudgetFull():BudgetList {
        return this.#budgetList;
    }

    getBudgetMonthYears():number[] {
        return Object.keys(this.#budgetList).sort().reduce((acc:number[], cur) => acc.concat(Number(cur)), []);
    }

    getBudgetMonth(month:Months, year:number):BudgetForMonth {
        const monthYear = (year*100)+month;
        return this.#budgetList[monthYear];
    }

    getBudgetMonthById(monthYear:number):BudgetForMonth {
        return this.#budgetList[monthYear];
    }

    readFromLocalBudgetMonths():BudgetList {
        let data = getBudgetList();
        let savedProj:BudgetList = {};
        Object.keys(data).forEach(gpKey => {
            if (typeof gpKey === "string") {
                let innerData = data[gpKey];
                if (innerData.hasOwnProperty('amount') && typeof innerData.amount === "number" && innerData.hasOwnProperty('month') && typeof innerData.month === "number" && innerData.hasOwnProperty('year') && typeof innerData.year === "number")  {
                    savedProj[Number(gpKey)] = innerData;
                } else {
                    logError("BudgetData readFromLocalBudgetMonths BudgetForMonth", 'Inner data missing', innerData);
                }
            } else {
                logError("BudgetData readFromLocalBudgetMonths BudgetList", 'list bad keys', data[gpKey]);
            }
        });
        return savedProj;
    }

    clearAll() {
        this.#budgetList = {};
        setBudgetList(this.#budgetList);
    }

}

const budgetData = BudgetData.instance;
export default budgetData;