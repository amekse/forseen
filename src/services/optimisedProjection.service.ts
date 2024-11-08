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
import { Months } from "../types/common.types";

function validateProjectedToBudget () {
    const projectedMonthsList = generalProjectedMonthList.getProjectedMonthsList();
    projectedMonthsList.forEach(monthYearKey => {
        const monthYear = Number(monthYearKey);
        budgetData.addForMonth({
            month: (monthYear%100) as Months,
            year: Math.trunc(monthYear/100),
            amount: 0
        })
    })
}

function optimiseBudget() {
    validateProjectedToBudget();
    
}

export {
    optimiseBudget
}