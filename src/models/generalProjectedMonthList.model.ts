import { getGeneralProjection, setGeneralProjection } from "../services/localStoring.service";
import { Months } from "../types/common.types";
import { GeneralProjected, GeneralProjectedForMonth, GeneralProjectedList, GeneralProjectedNoId } from "../types/generalProjected.types";
import { v4 as uuidv4 } from 'uuid';
import { logError } from "../utils/logger.utils";
import budgetData from "./budget.model";

class GeneralProjectedMonthList {
    static #instance: GeneralProjectedMonthList;
    #projectedMonths:GeneralProjectedList = this.readFromLocalProjectedMonths();

    private constructor() {}

    public static get instance(): GeneralProjectedMonthList {
        if (!GeneralProjectedMonthList.#instance) {
            GeneralProjectedMonthList.#instance = new GeneralProjectedMonthList();
        }

        return GeneralProjectedMonthList.#instance;
    }

    readFromLocalProjectedMonths():GeneralProjectedList {
        let data = getGeneralProjection();
        let savedProj:GeneralProjectedList = {};
        let errorList = [];
        Object.keys(data).forEach(gpKey => {
            if (typeof gpKey === "number") {
                let innerData = data[gpKey];
                if (innerData.hasOwnProperty('totalCost') && typeof innerData.totalCost === "number" && innerData.hasOwnProperty('items') && typeof innerData.items === "object")  {
                    savedProj[gpKey] = innerData;
                } else {
                    errorList.push('Inner data missing');
                    logError("GeneralProjectedMonthList readFromLocalProjectedMonths GeneralProjectedForMonth", errorList, innerData);
                }
            } else {
                errorList.push('list bad keys');
                logError("GeneralProjectedMonthList readFromLocalProjectedMonths GeneralProjectedList", errorList, data[gpKey]);
            }
        });
        return savedProj;
    }

    add(data:GeneralProjectedNoId) {
        // console.log(data)
        const genProj:GeneralProjected = {
            id: `genprj-${uuidv4()}`,
            ...data
        };

        const monthYear = (genProj.year*100)+genProj.month;

        if (this.#projectedMonths[monthYear] === undefined) {
            this.#projectedMonths[monthYear] = {
                items: [],
                totalCost: 0
            }
        }
        this.#projectedMonths[monthYear].items.push(genProj);
        this.#projectedMonths[monthYear].totalCost += Math.round(genProj.cost);

        budgetData.recalculateBudget(genProj.month, genProj.year, this.#projectedMonths[monthYear]);
        setGeneralProjection(this.#projectedMonths);
    }

    getFull():GeneralProjectedList {
        return this.#projectedMonths;
    }

    getMonth(month: Months, year: number): GeneralProjectedForMonth {
        const monthYear = (year*100)+month;
        if (this.#projectedMonths[monthYear] !== undefined) {
            return this.#projectedMonths[monthYear];
        } else {
            let emptyData:GeneralProjectedForMonth = {
                totalCost: 0,
                items: []
            };
            return emptyData;
        }
    }

    getPeriod(startMonth:Months, startYear: number, endMonth:Months, endYear: number):GeneralProjectedList {
        let countMonthYear = (startYear*100)+startMonth;
        const endMonthYear = (endYear*100)+endMonth;
        let projectedPeriod:GeneralProjectedList = {};
        while(countMonthYear <= endMonthYear) {
            if (this.#projectedMonths[countMonthYear] !== undefined) {
                projectedPeriod[countMonthYear] = this.#projectedMonths[countMonthYear];
            }
            if (countMonthYear%100 === 12) {
                let lastYear = Math.trunc(countMonthYear/100);
                countMonthYear = ((lastYear+1)*100)+1;
            } else {
                countMonthYear += 1;
            }
        }

        return projectedPeriod;
    }

    clearAll() {
        this.#projectedMonths = [];
        setGeneralProjection(this.#projectedMonths);
    }
}

const generalProjectedMonthList = GeneralProjectedMonthList.instance;

export default generalProjectedMonthList;