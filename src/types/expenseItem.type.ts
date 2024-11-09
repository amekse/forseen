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

type ExpensesList = {
    [key:number]: ExpenseItem,
    'high': ExpenseItem[],
    'medium': ExpenseItem[],
    'low': ExpenseItem[]
}

export type {
    ExpenseItem,
    ExpensesList
};