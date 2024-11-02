import { Months } from "./common.types"

type ExpenseItemNoId = {
    itemName: string,
    cost: number,
    saveDateStart: {
        month: Months,
        year: number
    },
    saveDateEnd: {
        month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
        year: number
    },
    monthlyBudget: number[]
}

type ExpenseItem = {
    uuid: string,
} & ExpenseItemNoId

export type {
    ExpenseItemNoId,
    ExpenseItem
};