import { setExpenseList } from "../services/localStoring.service";
import { ExpenseItem, ExpenseItemI, ExpenseReadList, ExpensesList } from "../types/expense.type";
import { v4 as uuid } from 'uuid';

class ExpenseData {
    static #instance: ExpenseData;
    #expenseList:ExpensesList = {
        high: [],
        medium: [],
        low: []
    };
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



    getExpensesList():ExpenseReadList {
        let expenseList:ExpenseReadList = []
        expenseList = expenseList.concat(this.#expenseList.high);
        expenseList = expenseList.concat(this.#expenseList.medium);
        expenseList = expenseList.concat(this.#expenseList.low);
        return expenseList;
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