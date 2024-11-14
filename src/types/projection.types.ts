import { BudgetForMonth } from "./budget.type";
import { Months } from "./common.types";
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

type ExpenseItemIWithProjectedMonth = {
    projectedMonth: Months,
    projectedYear: number
} & ExpenseItemI

type ProjectedDetails = {
    failedProjections: ExpenseItemI[],
    successfulProjections: ExpenseItemIWithProjectedMonth[]
    projectionList: ProjectionList
}

export type {
    ProjectionMonth,
    ProjectionList,
    ProjectedDetails,
    ExpenseItemIWithProjectedMonth
}