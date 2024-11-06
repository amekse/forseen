import { Months } from "./common.types"

type BudgetForMonth = {
    month: Months,
    year: number,
    amount: number,
}

type BudgetWithAdjustment = {
    extraAmount: number,
    adjustAmount: number,
    availableAdjustment: number
} & BudgetForMonth;

type BudgetList = {
    [key:number] : BudgetWithAdjustment
}

export type {
    BudgetForMonth,
    BudgetList,
    BudgetWithAdjustment
}