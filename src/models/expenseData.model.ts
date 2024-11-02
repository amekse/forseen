import { ErrorMessages } from "../types/common.types";
import { ExpenseItem, ExpenseItemNoId } from "../types/expenseItem.type";
import { v4 as uuidv4 } from 'uuid';

class ExpenseData {
    #defaultData:ExpenseItem = {
        uuid: `expdata-${uuidv4()}`,
        itemName: "Unnamed Expense",
        cost: 0,
        saveDateStart: {
            month: 1,
            year: 2024
        },
        saveDateEnd: {
            month: 1,
            year: 2024
        }
    }
    #error: ErrorMessages = false;

    constructor(data:ExpenseItemNoId) {
        const errorList:string[] = [];
        if (data.itemName.trim() !== '') {
            this.#defaultData.itemName = data.itemName;
        } else {
            errorList.push('Name not present');
        }

        if (data.cost > 0) {
            this.#defaultData.cost = data.cost;
        } else {
            errorList.push('Cost cannot be 0')
        }

        if (data.saveDateEnd.month > data.saveDateStart.month && data.saveDateStart.month > 2024 && data.saveDateEnd.month >= data.saveDateStart.month) {
            this.#defaultData.saveDateStart = data.saveDateStart;
            this.#defaultData.saveDateEnd = data.saveDateEnd;
        } else {
            errorList.push('End date must be greater than start date or year must be greater than 2024');
        }
        this.#error = errorList;
    }

    set (data:ExpenseItemNoId):ExpenseItem {
        const errorList:string[] = [];
        if (data.itemName.trim() !== '') {
            this.#defaultData.itemName = data.itemName;
        } else {
            errorList.push('Name not present');
        }

        if (data.cost > 0) {
            this.#defaultData.cost = data.cost;
        } else {
            errorList.push('Cost cannot be 0')
        }

        if (data.saveDateEnd.month > data.saveDateStart.month && data.saveDateStart.month > 2024 && data.saveDateEnd.month >= data.saveDateStart.month) {
            this.#defaultData.saveDateStart = data.saveDateStart;
            this.#defaultData.saveDateEnd = data.saveDateEnd;
        } else {
            errorList.push('End date must be greater than start date or year must be greater than 2024');
        }
        this.#error = errorList;
        return this.#defaultData;
    }

    get ():ExpenseItem {
        return this.#defaultData;
    }

    getError ():ErrorMessages {
        return this.#error;
    }
}

export default ExpenseData;