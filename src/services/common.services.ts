import budgetData from "../models/budget.model";

function clearAllData () {
    budgetData.clearAll();
}

export {
    clearAllData
}