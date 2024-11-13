import { getExpenseList, setExpenseList } from "../services/localStoring.service";
import { logError } from "../services/logger.services";
import { ExpenseItem, ExpenseItemI, ExpenseReadList, ExpensesList } from "../types/expense.type";
import { v4 as uuid } from 'uuid';

class ExpenseData {
    static #instance: ExpenseData;
    #expenseList:ExpensesList = this.readFromLocalExpense();
    private constructor() {}

    public static get instance(): ExpenseData {
        if (!ExpenseData.#instance) {
            ExpenseData.#instance = new ExpenseData();
        }

        return ExpenseData.#instance;
    }

    addExpense(expense:ExpenseItem) {
        const expenseI: ExpenseItemI = {
            ...expense,
            id: uuid()
        }
        this.#expenseList[expense.priority].push(expenseI);
        setExpenseList(this.#expenseList);
    }

    readFromLocalExpense():ExpensesList {
        let data = getExpenseList();
        let savedProj:ExpensesList = {
            high: [],
            medium: [],
            low: []
        };
        Object.keys(data).forEach(xpKey => {
            switch (xpKey) {
                case 'high': savedProj.high = data.high; break;
                case 'medium': savedProj.medium = data.medium; break;
                case 'low': savedProj.low = data.low; break;
                default: logError("ExpenseData readFromLocalExpense BudgetList", 'list bad keys', xpKey);
            }
        });
        return savedProj;
    }

    getExpensesList():ExpenseReadList {
        let expenseList:ExpenseReadList = []
        expenseList = expenseList.concat(this.#expenseList.high);
        expenseList = expenseList.concat(this.#expenseList.medium);
        expenseList = expenseList.concat(this.#expenseList.low);
        return expenseList;
    }

    getExpenseCategoryList():ExpensesList {
        return this.#expenseList;
    }

    clearAll() {
        this.#expenseList = {
            'high': [],
            'medium': [],
            'low': []
        };
        setExpenseList(this.#expenseList);
    }
}

const expenseData = ExpenseData.instance;
export default expenseData;