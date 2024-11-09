import { Months } from "./common.types"

type BudgetForMonth = {
    month: Months,
    year: number,
    amount: number,
}

type BudgetList = {
    [key:number] : BudgetForMonth
}

type AverageBudget = {
    startMonth: Months,
    endMonth: Months,
    startYear: number,
    endYear: number,
    amount: number
}

export type {
    BudgetForMonth,
    BudgetList,
    AverageBudget
}