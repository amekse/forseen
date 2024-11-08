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