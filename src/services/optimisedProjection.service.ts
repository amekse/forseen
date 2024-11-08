/*
TODO: 
2. check all projected months must have a budget - done
3. now we check from start budget list/month till n'th given, how much can be adjusted from extra amount 
4. after adjustment if extra remains 
4A. if no extra months are given with budget we keep adding each new month with budget as average from previous budget list and adjust the extra amount there
4B. if extra months given with budget we adjust there
5. next we search for the costliest / least priority item in the expenses list and put them to delay list
6. check if extra amount crosses total amount from delay list, we search for the next higher/lesser/same priority/cost item and add that to delay
7. check the delay list for which month covers the cost for the highest priority or lesser cost item and continue for all in the list
8. show user
*/

import budgetData from "../models/budget.model";
import generalProjectedMonthList from "../models/generalProjectedMonthList.model"
import { ErrorMessages, Months } from "../types/common.types";
import { logError } from "../utils/logger.utils";

function validateProjectedToBudget(): ErrorMessages {
    let errorList:ErrorMessages = [];
    const projectedMonthsList = generalProjectedMonthList.getProjectedMonthsList();
    projectedMonthsList.forEach(monthYearKey => {
        const monthYear = Number(monthYearKey);
        errorList.push(`Please add budget for ${monthYear%100} ${Math.trunc(monthYear/100)}.`)
    });
    logError('No budget added for projection', errorList);
    return errorList.length > 0 ? errorList : false;
}

function adjustExtraCost ():ErrorMessages {
    let leftOverExtraCost = budgetData.getTotalExtraAmount();
    const projectedMonthsList = generalProjectedMonthList.getProjectedMonthsList().sort();
    let errorList:ErrorMessages = [];
    for(let mthCnt=0; mthCnt < (projectedMonthsList.length - 1) && leftOverExtraCost > 0; mthCnt+1) {
        const month = (Number(projectedMonthsList[mthCnt]))%100 as Months;
        const year = Math.trunc((Number(projectedMonthsList[mthCnt])))/100;
        let availableAdjustment = budgetData.getMonth(month, year).availableAdjustment;
        if (availableAdjustment < leftOverExtraCost) {
            leftOverExtraCost -= availableAdjustment;
        } else {
            availableAdjustment = leftOverExtraCost;
            leftOverExtraCost = 0;
        }
        let error = budgetData.setAdjustmentAmount(availableAdjustment, Number(projectedMonthsList[mthCnt]), month, year);
        if (error) {
            errorList = [...errorList, ...error];
        }
    }
    return errorList.length > 0 ? errorList : false;
}

function optimiseBudget():ErrorMessages {
    const validationErrors = validateProjectedToBudget();
    const adjustExtraErrors = adjustExtraCost();
    if (validationErrors && adjustExtraErrors) {
        return [...validationErrors, ...adjustExtraErrors];
    } else {
        return false;
    }
}

export {
    optimiseBudget
}