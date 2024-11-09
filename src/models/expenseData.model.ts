import { setExpenseList } from "../services/localStoring.service";
import { ErrorMessages } from "../types/common.types";
import { ExpenseItem, ExpensesList } from "../types/expenseItem.type";

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

    addExpense(expense:ExpenseItem): ErrorMessages {
        if (expense.date === 'none' && expense.priority !== 'none') {
            this.#expenseList[expense.priority].push(expense);
            setExpenseList(this.#expenseList);
            return false;
        } else if (expense.date !== 'none' && expense.priority === 'none') {
            const monthYear = (expense.date.year*100)+expense.date.month;
            this.#expenseList[monthYear] = expense;
            setExpenseList(this.#expenseList);
            return false;
        } else {
            return 'Expense can have either date or priority.';
        }
    }

    getExpensesList():ExpensesList {
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