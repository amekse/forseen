import { BudgetForMonth } from "./budget.type";
import { ExpenseItemI } from "./expense.type";

type ProjectionMonth = {
    usedAmount: number,
    expensesItem: ExpenseItemI[];
} & BudgetForMonth;

type ProjectionList = {
    monthYears: number[],
    totalLeftOverBudget: number,
    [key:number]: ProjectionMonth
};

type ProjectedDetails = {
    errorList: string[],
    projectionList: ProjectionList
}

export type {
    ProjectionMonth,
    ProjectionList,
    ProjectedDetails
}