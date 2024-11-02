import { Months } from "./common.types"

type GeneralProjectedNoId = {
    month: Months,
    year: number,
    cost: number,
    budget: number,
}

type GeneralProjected = {
    id: string,
} & GeneralProjectedNoId

type GeneralProjectedList = {
    [monthYear:number]: {
        totalCost: number
        items: GeneralProjected[]
    }
}

export type {
    GeneralProjected,
    GeneralProjectedNoId,
    GeneralProjectedList
}