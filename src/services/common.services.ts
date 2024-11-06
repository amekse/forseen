import budgetData from "../models/budget.model";
import generalProjectedMonthList from "../models/generalProjectedMonthList.model"

function clearAllData () {
    generalProjectedMonthList.clearAll();
    budgetData.clearAll();
}

export {
    clearAllData
}