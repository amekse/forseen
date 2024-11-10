import { Priority } from "./common.types"

type ExpenseItem = {
    itemName: string,
    itemDescription: string | "",
    cost: number,
    priority: Priority
}

type ExpenseItemI = {
    id: string
} & ExpenseItem

type ExpensesList = {
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