import { Months } from "../types/common.types";
import { GeneralProjected, GeneralProjectedList, GeneralProjectedNoId } from "../types/generalProjected.types";
import { v4 as uuidv4 } from 'uuid';

class GeneralProjectedMonthList {
    #projectedMonths:GeneralProjectedList = {};

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
    }

    getFull() {
        return this.#projectedMonths;
    }

    getMonth(month: Months, year: number) {
        const monthYear = (year*100)+month;
        return this.#projectedMonths[monthYear];
    }

    getPeriod(startMonth:Months, startYear: number, endMonth:Months, endYear: number) {
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

export default GeneralProjectedMonthList;