import { setExpenseList } from "../services/localStoring.service";
import { ErrorMessages } from "../types/common.types";
import { ExpenseItem, ExpenseItemI, ExpenseReadList, ExpensesList } from "../types/expense.type";
import { v4 as uuid } from 'uuid';

class ExpenseData {
    static #instance: ExpenseData;
    #expenseList:ExpensesList = {
        high: [],
        medium: [],
        low: [],
        monthYears: new Set()
    };
    private constructor() {}

    public static get instance(): ExpenseData {
        if (!ExpenseData.#instance) {
            ExpenseData.#instance = new ExpenseData();
        }

        return ExpenseData.#instance;
    }

    addExpense(expense:ExpenseItem): ErrorMessages {
        const expenseI: ExpenseItemI = {
            ...expense,
            id: uuid()
        }
        if (expense.date === 'none' && expense.priority !== 'none') {
            this.#expenseList[expense.priority].push(expenseI);
            setExpenseList(this.#expenseList);
            return false;
        } else if (expense.date !== 'none' && expense.priority === 'none') {
            const monthYear = (expense.date.year*100)+expense.date.month;
            this.#expenseList.monthYears.add(monthYear);
            if (this.#expenseList[monthYear]) {
                this.#expenseList[monthYear].push(expenseI);
            } else {
                this.#expenseList[monthYear] = [expenseI];
            }
            setExpenseList(this.#expenseList);
            return false;
        } else {
            return 'Expense can have either date or priority.';
        }
    }



    getExpensesList():ExpenseReadList {
        let expenseList:ExpenseReadList = []
        const sortedMonthYears = Array.from(this.#expenseList.monthYears).sort();
        sortedMonthYears.forEach(monthYear => {
            this.#expenseList[monthYear].forEach(exp => {
                expenseList.push(exp);
            })
        })
        expenseList = expenseList.concat(this.#expenseList.high);
        expenseList = expenseList.concat(this.#expenseList.medium);
        expenseList = expenseList.concat(this.#expenseList.low);
        return expenseList;
    }

    clearAll() {
        this.#expenseList = {
            'high': [],
            'medium': [],
            'low': [],
            'monthYears': new Set()
        };
        setExpenseList(this.#expenseList);
    }
}

const expenseData = ExpenseData.instance;
export default expenseData;