import { BudgetForMonth } from "./budget.type";

type ProjectionMonth = {
    usedAmount: number,
    expensesItem: string[]; // expense ids
} & BudgetForMonth;

type ProjectionList = {
    monthYears: number[],
    totalLeftOverBudget: number,
    [key:number]: ProjectionMonth
};

type ProjectedData = {
    errorList: string[],
    projectionList: ProjectionList
}

export type {
    ProjectionMonth,
    ProjectionList,
    ProjectedData
}