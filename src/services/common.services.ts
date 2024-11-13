import budgetData from "../models/budget.model";
import expenseData from "../models/expense.model";

function clearAllData () {
    budgetData.clearAll();
    expenseData.clearAll();
}

export {
    clearAllData
}