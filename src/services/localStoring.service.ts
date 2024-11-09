import { BudgetList } from "../types/budget.type";
import { ExpensesList } from "../types/expense.type";
import { logUntrackedError } from "./logger.services";

function setExpenseList(data:ExpensesList) {
    localStorage.setItem('lastExpList', JSON.stringify(data));
}

function getExpenseList():any {
    let jsonData:any = {};
    let data = localStorage.getItem('lastExpList') ?? "{}";
    try {
        jsonData = JSON.parse(data);
    } catch (e:any) {
        logUntrackedError('LocalStorage service expense list', e);
    }
    return jsonData;
}

function setBudgetList(data:BudgetList) {
    localStorage.setItem('lastBudgetList', JSON.stringify(data));
}

function getBudgetList():any {
    let jsonData:any = {};
    let data = localStorage.getItem('lastBudgetList') ?? "{}";
    try {
        jsonData = JSON.parse(data);
    } catch (e:any) {
        logUntrackedError('LocalStorage service budget list', e);
    }
    return jsonData;
}

export {
    getExpenseList,
    setExpenseList,
    getBudgetList,
    setBudgetList
}