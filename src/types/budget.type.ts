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

type BudgetForPeriod = {
    startMonth: Months,
    endMonth: Months,
    startYear: number,
    endYear: number,
    amount: number
}

export type {
    BudgetForMonth,
    BudgetList,
    BudgetWithAdjustment,
    BudgetForPeriod
}