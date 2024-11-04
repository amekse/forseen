import { getGeneralProjection, setGeneralProjection } from "../services/localStoring.service";
import { Months } from "../types/common.types";
import { GeneralProjected, GeneralProjectedForMonth, GeneralProjectedList, GeneralProjectedNoId } from "../types/generalProjected.types";
import { v4 as uuidv4 } from 'uuid';
import logError from "../utils/logError.utils";

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
        Object.keys(data).forEach(gpKey => {
            if (typeof gpKey === "number") {
                let innerData = data[gpKey];
                if (innerData.hasOwnProperty('totalCost') && typeof innerData.totalCost === "number" && innerData.hasOwnProperty('items') && typeof innerData.items === "object")  {
                    savedProj[gpKey] = innerData;
                } else {
                    logError("GeneralProjectedMonthList readFromLocalProjectedMonths GeneralProjectedForMonth", innerData);
                }
            } else {
                logError("GeneralProjectedMonthList readFromLocalProjectedMonths GeneralProjectedList", data[gpKey]);
            }
        });
        return savedProj;
    }

    add(data:GeneralProjectedNoId) {
        const genProj:GeneralProjected = {
            id: `genprj-${uuidv4()}`,
            ...data
        };

        const monthYear = (genProj.year*100)+genProj.month;
        this.#projectedMonths[monthYear].items.push(genProj);
        if (this.#projectedMonths[monthYear].totalCost) {
            this.#projectedMonths[monthYear].totalCost += genProj.cost;
        } else {
            this.#projectedMonths[monthYear].totalCost = genProj.cost;
        }

        setGeneralProjection(this.#projectedMonths);
    }

    getFull():GeneralProjectedList {
        return this.#projectedMonths;
    }

    getMonth(month: Months, year: number): GeneralProjectedForMonth {
        const monthYear = (year*100)+month;
        return this.#projectedMonths[monthYear];
    }

    getPeriod(startMonth:Months, startYear: number, endMonth:Months, endYear: number):GeneralProjectedList {
        let countMonthYear = (startYear*100)+startMonth;
        const endMonthYear = (endYear*100)+endMonth;
        let projectedPeriod:GeneralProjectedList = {};
        while(countMonthYear <= endMonthYear) {
            projectedPeriod[countMonthYear] = this.#projectedMonths[countMonthYear];
            if (countMonthYear%100 === 12) {
                let lastYear = Math.trunc(countMonthYear/100);
                countMonthYear = ((lastYear+1)*100)+1;
            } else {
                countMonthYear += 1;
            }
        }

        return projectedPeriod;
    }
}

const generalProjectedMonthList = GeneralProjectedMonthList.instance;

export default generalProjectedMonthList;