import expenseData from "../../models/expenseData.model"
import { clearAllData } from "../../services/common.services"
import { ExpenseItem, ExpensesList } from "../../types/expenseItem.type"

describe('test expense add and read', () => {
    const testExpensesList:ExpenseItem[] = [
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
            itemName: "Television",
            itemDescription: "",
            cost: 6000,
            date: {
                month: 1,
                year: 2025
            },
            priority: 'none'
        },
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
        const expected:ExpensesList = {
            202501: {
                itemName: 'Television',
                itemDescription: '',
                cost: 6000,
                date: {
                    month: 1,
                    year: 2025
                },
                priority: 'none'
            },
            'high': [
                {
                    itemName: "Fridge",
                    itemDescription: "",
                    cost: 5000,
                    date: 'none',
                    priority: 'high'
                }
            ],
            'medium': [
                {
                    itemName: "Mobile",
                    itemDescription: "",
                    cost: 2000,
                    date: 'none',
                    priority: 'medium'
                }
            ],
            'low': []
        }

        const actual = expenseData.getExpensesList();
        expect(actual).toEqual(expected);
    })
})