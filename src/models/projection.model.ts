import { ErrorMessages } from "../types/common.types";
import { ExpenseItemI } from "../types/expense.type";
import { ProjectedData, ProjectionList } from "../types/projection.types";
import budgetData from "./budget.model";
import expenseData from "./expense.model";

class ProjectionData {
    #projectionsList:ProjectionList = {
        monthYears: [],
        totalLeftOverBudget: 0
    };

    constructor() {
        const budgetList = budgetData.getBudgetFull();
        const budgetMonthYears = budgetData.getBudgetMonthYears();
        this.#projectionsList.monthYears = budgetMonthYears;
        budgetMonthYears.forEach(monthYear => {
            this.#projectionsList[monthYear] = {
                ...budgetList[monthYear],
                usedAmount: 0,
                expensesItem: []
            }
            this.#projectionsList.totalLeftOverBudget += budgetList[monthYear].amount;
        })
    }

    #calculateMonthsNeededForExpense(expense:ExpenseItemI, errorList:string[]):string[] {
        let leftoverCost = expense.cost;
        if (leftoverCost > this.#projectionsList.totalLeftOverBudget) {
            errorList.push(`Not enough budget for ${expense.itemName}, please add more budget to cover the amount ${this.#projectionsList.totalLeftOverBudget - leftoverCost}`);
        } else {
            for(let curMthYr = 0; leftoverCost > 100 && curMthYr < this.#projectionsList.monthYears.length; curMthYr++) {
                let projectionMonth = this.#projectionsList[this.#projectionsList.monthYears[curMthYr]];
                if (leftoverCost <= projectionMonth.amount) {
                    projectionMonth.usedAmount += leftoverCost;
                    projectionMonth.amount -= leftoverCost;
                    leftoverCost = 0;
                } else {
                    projectionMonth.usedAmount = leftoverCost - projectionMonth.amount;
                    leftoverCost -= projectionMonth.amount;
                    projectionMonth.amount = 0;
                }
                projectionMonth.expensesItem.push(expense.id);
                this.#projectionsList[this.#projectionsList.monthYears[curMthYr]] = projectionMonth;
            }
            this.#projectionsList.totalLeftOverBudget -= leftoverCost;
        }
        return errorList;
    }

    projectForAll():ProjectedData {
        let errorList:string[] = [];
        const expenseList = expenseData.getExpensesList();
        expenseList.forEach(expense => {
            this.#calculateMonthsNeededForExpense(expense, errorList);
        })
        return {
            errorList,
            projectionList: this.#projectionsList
        }
    }
}

export default ProjectionData;