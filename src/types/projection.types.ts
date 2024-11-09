import { Months } from "./common.types"

type ProjectionItem = {
    itemName: string,
    itemCost: number,
    month: Months,
    year: number,
    projectionIssue: string | null
}

export type {
    ProjectionItem
}