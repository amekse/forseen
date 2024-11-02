type GeneralProjectedNoId = {
    month: Months,
    year: number,
    cost: number,
    name: string
}

type GeneralProjected = {
    id: string,
} & GeneralProjectedNoId

type GeneralProjectedForMonth = {
    totalCost: number,
    budget: number,
    items: GeneralProjected[]
}

type GeneralProjectedList = {
    [monthYear:number]: GeneralProjectedForMonth
}

export type {
    GeneralProjected,
    GeneralProjectedNoId,
    GeneralProjectedList,
    GeneralProjectedForMonth
}