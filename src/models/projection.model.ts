import { Months } from "../types/common.types";
import { ExpenseItemI } from "../types/expense.type";
import { ExpenseItemIWithProjectedMonth, ProjectedDetails, ProjectionList } from "../types/projection.types";
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
                expensesItem: [],
            }
            this.#projectionsList.totalLeftOverBudget += budgetList[monthYear].amount;
        })
    }

    #calculateMonthsNeededForExpense(expense:ExpenseItemI, failedProjections:ExpenseItemI[], successfulProjections:ExpenseItemIWithProjectedMonth[]):{failed: ExpenseItemI[], successful: ExpenseItemIWithProjectedMonth[]} {
        let leftoverCost = expense.cost;
        if (leftoverCost > this.#projectionsList.totalLeftOverBudget) {
            failedProjections.push(expense);
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
                    if (leftoverCost <= 100) {
                        successfulProjections.push({
                            ...expense,
                            projectedMonth: projectionMonth.month,
                            projectedYear: projectionMonth.year
                        })
                    }
                    projectionMonth.expensesItem.push(expense);
                    this.#projectionsList[this.#projectionsList.monthYears[curMthYr]] = projectionMonth;
                    this.#projectionsList.totalLeftOverBudget -= projectionMonth.usedAmount;
                }
            }
        }
        return {
            failed: failedProjections,
            successful: successfulProjections
        };
    }

    projectForAll():ProjectedDetails {
        let failedProjections:ExpenseItemI[] = [];
        let successfulProjections:ExpenseItemIWithProjectedMonth[] = [];
        const expenseList = expenseData.getExpensesList();
        expenseList.forEach(expense => {
            this.#calculateMonthsNeededForExpense(expense, failedProjections, successfulProjections);
        })
        return {
            failedProjections,
            projectionList: this.#projectionsList,
            successfulProjections
        }
    }
}

export default ProjectionData;