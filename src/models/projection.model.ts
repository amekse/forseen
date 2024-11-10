import { ExpenseItemI } from "../types/expense.type";
import { ProjectedDetails, ProjectionList } from "../types/projection.types";
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
            errorList.push(`Not enough budget for ${expense.itemName}, please add more budget to cover the amount ${leftoverCost - this.#projectionsList.totalLeftOverBudget}`);
        } else {
            for(let curMthYr = 0; leftoverCost > 100 && curMthYr < this.#projectionsList.monthYears.length; curMthYr++) {
                let projectionMonth = this.#projectionsList[this.#projectionsList.monthYears[curMthYr]];
                if (projectionMonth.amount > 0) {
                    if (leftoverCost <= projectionMonth.amount) {
                        projectionMonth.usedAmount += leftoverCost;
                        projectionMonth.amount -= leftoverCost;
                        leftoverCost = 0;
                    } else {
                        projectionMonth.usedAmount += projectionMonth.amount;
                        leftoverCost -= projectionMonth.amount;
                        projectionMonth.amount = 0;
                    }
                    projectionMonth.expensesItem.push(expense);
                    this.#projectionsList[this.#projectionsList.monthYears[curMthYr]] = projectionMonth;
                    this.#projectionsList.totalLeftOverBudget -= projectionMonth.usedAmount;
                }
            }
        }
        return errorList;
    }

    projectForAll():ProjectedDetails {
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