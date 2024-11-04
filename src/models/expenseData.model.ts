import { ErrorMessages } from "../types/common.types";
import { ExpenseItem, ExpenseItemNoId } from "../types/expenseItem.type";
import { v4 as uuidv4 } from 'uuid';
import logError from "../utils/logError.utils";

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

        const monthYearStart = (data.saveDateStart.year*100)+data.saveDateStart.month;
        const monthYearEnd = (data.saveDateEnd.year*100)+data.saveDateEnd.month;
        if (monthYearEnd > monthYearStart) {
            this.#defaultData.saveDateStart = data.saveDateStart;
            this.#defaultData.saveDateEnd = data.saveDateEnd;
        } else {
            errorList.push('End date must be greater than start date or year must be greater than 2024');
        }
        
        if (errorList.length > 0) {
            this.#error = errorList;
            logError("Expense Data Constructor", this.#error);
        }
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

        const monthYearStart = (data.saveDateStart.year*100)+data.saveDateStart.month;
        const monthYearEnd = (data.saveDateEnd.year*100)+data.saveDateEnd.month;
        if (monthYearEnd > monthYearStart) {
            this.#defaultData.saveDateStart = data.saveDateStart;
            this.#defaultData.saveDateEnd = data.saveDateEnd;
        } else {
            errorList.push('End date must be greater than start date or year must be greater than 2024');
        }
        if (errorList.length > 0) {
            this.#error = errorList;
            logError("Expense Data Set", this.#error);
        }
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