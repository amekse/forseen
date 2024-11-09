import { Months, Priority } from "./common.types"

type ExpenseItem = {
    itemName: string,
    itemDescription: string | "",
    cost: number,
    date: {
        month: Months,
        year: number
    } | 'none',
    priority: Priority | 'none'
}

type ExpenseItemI = {
    id: string
} & ExpenseItem

type ExpensesList = {
    [key:number]: ExpenseItemI[],
    'monthYears': Set<number>,
    'high': ExpenseItemI[],
    'medium': ExpenseItemI[],
    'low': ExpenseItemI[]
}

type ExpenseReadList = ExpenseItemI[]

export type {
    ExpenseItem,
    ExpenseItemI,
    ExpensesList,
    ExpenseReadList
};