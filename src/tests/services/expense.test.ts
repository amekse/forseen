import expenseData from "../../models/expense.model"
import { clearAllData } from "../../services/common.services"
import { ExpenseItem, ExpenseReadList, ExpensesList } from "../../types/expense.type"

describe('test expense add and read', () => {
    const testExpensesList:ExpenseItem[] = [
        {
            itemName: "Television",
            itemDescription: "",
            cost: 6000,
            date: {
                month: 1,
                year: 2025
            },
            priority: 'none'
        },
        {
            itemName: "Fridge",
            itemDescription: "",
            cost: 5000,
            date: 'none',
            priority: 'high'
        },
        {
            itemName: "Mobile",
            itemDescription: "",
            cost: 2000,
            date: 'none',
            priority: 'medium'
        },
        {
            itemName: "Washer",
            itemDescription: "",
            cost: 4000,
            date: {
                month: 1,
                year: 2025
            },
            priority: 'none'
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
                itemName: "Television",
                itemDescription: "",
                cost: 6000,
                date: {
                    month: 1,
                    year: 2025
                },
                priority: 'none'
            },
            {
                id: '',
                itemName: "Washer",
                itemDescription: "",
                cost: 4000,
                date: {
                    month: 1,
                    year: 2025
                },
                priority: 'none'
            },
            {
                id: '',
                itemName: "Fridge",
                itemDescription: "",
                cost: 5000,
                date: 'none',
                priority: 'high'
            },
            {
                id: '',
                itemName: "Mobile",
                itemDescription: "",
                cost: 2000,
                date: 'none',
                priority: 'medium'
            }
        ]

        const actual = expenseData.getExpensesList();
        for (let actCnt = 0; actCnt < actual.length; actCnt++) {
            actual[actCnt].id = '';
        }
        console.log(actual)
        expect(actual).toEqual(expected);
    })
})