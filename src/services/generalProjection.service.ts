import ExpenseData from "../models/expenseData.model";
import generalProjectedMonthList from "../models/generalProjectedMonthList.model";
import { ErrorMessages, Months } from "../types/common.types";
import { ExpenseItem } from "../types/expenseItem.type";

function totalMonthsCount(expenseItem:ExpenseItem):number {
    const endMonthYear = (expenseItem.saveDateEnd.year*100)+expenseItem.saveDateEnd.month;
    let countMonthYear = (expenseItem.saveDateStart.year*100)+expenseItem.saveDateStart.month;
    let totalMonths = 0;

    while (countMonthYear <= endMonthYear) {
        totalMonths += 1;
        let currentYear = Math.trunc(countMonthYear/100);
        if (countMonthYear%100 === 12) {
            countMonthYear = ((currentYear+1)*100)+1;
        } else {
            countMonthYear += 1;
        }
    }

    return totalMonths;
}

function addExpenseToList(data:ExpenseData): ErrorMessages {
    const expenseItemError = data.getError();
    if (expenseItemError) {
        return expenseItemError;
    } else {
        const expenseItem = data.get();
        const totalMonths = totalMonthsCount(expenseItem);
        const monthlyCost = expenseItem.cost/totalMonths;

        let countYear = expenseItem.saveDateStart.year;
        let countMonth = expenseItem.saveDateStart.month;
        for (let curMonth = 0; curMonth < totalMonths; curMonth++) {
            countMonth = countMonth + curMonth;

            generalProjectedMonthList.add({
                month: countMonth as Months,
                year: countYear,
                cost: monthlyCost,
                name: expenseItem.itemName
            })

            if (curMonth === 12) {
                countMonth = 1;
                countYear += 1;
            }
        }
    }
    return expenseItemError;
}

export {
    addExpenseToList
}