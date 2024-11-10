import expenseData from "../../models/expense.model"
import { clearAllData } from "../../services/common.services"
import { ExpenseItem, ExpenseReadList } from "../../types/expense.type"

describe('test expense add and read', () => {
    const testExpensesList:ExpenseItem[] = [
        {
            itemName: "Television",
            itemDescription: "",
            cost: 6000,
            priority: 'low'
        },
        {
            itemName: "Fridge",
            itemDescription: "",
            cost: 5000,
            priority: 'high'
        },
        {
            itemName: "Mobile",
            itemDescription: "",
            cost: 2000,
            priority: 'medium'
        }
    ]

    beforeAll(() => {
        testExpensesList.forEach(expense => {
            expenseData.addExpense(expense);
        })
    })

    afterAll(() => {
        clearAllData();
    })

    test('get expense full period', () => {
        const expected:ExpenseReadList = [
            {
                id: '',
                itemName: "Fridge",
                itemDescription: "",
                cost: 5000,
                priority: 'high'
            },
            {
                id: '',
                itemName: "Mobile",
                itemDescription: "",
                cost: 2000,
                priority: 'medium'
            },
            {
                id: '',
                itemName: "Television",
                itemDescription: "",
                cost: 6000,
                priority: 'low'
            }
        ]

        const actual = expenseData.getExpensesList();
        for (let actCnt = 0; actCnt < actual.length; actCnt++) {
            actual[actCnt].id = '';
        }
        expect(actual).toEqual(expected);
    })
})