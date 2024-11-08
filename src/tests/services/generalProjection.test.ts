import ExpenseData from "../../models/expenseData.model"
import generalProjectedMonthList from "../../models/generalProjectedMonthList.model"
import { clearAllData } from "../../services/common.services"
import { addExpenseToList } from "../../services/generalProjection.service"

describe('general projection', () => {
    const testExpenses:ExpenseData[] = [
        new ExpenseData({
            itemName: "Mobile",
            cost: 10000,
            saveDateStart: {
                month: 11,
                year: 2024
            },
            saveDateEnd: {
                month: 7,
                year: 2025
            }
        }),
        new ExpenseData({
            itemName: "Refrigerator",
            cost: 15000,
            saveDateStart: {
                month: 1,
                year: 2025
            },
            saveDateEnd: {
                month: 5,
                year: 2025
            }
        })
    ]

    beforeAll(() => {
        clearAllData();
    })

    afterEach(() => {
        clearAllData();
    })

    test('single expense for month', () => {
        const expected = {
            items: [
              {
                month: 12,
                year: 2024,
                cost: 1111,
                name: 'Mobile'
              }
            ],
            totalCost: 1111
        }

        addExpenseToList(testExpenses[0]);
        let actual = generalProjectedMonthList.getMonth(12, 2024);
        expect(actual).toMatchObject(expected);
    })

    test('multiple expense for month', () => {
        const expected = {
            items: [
              {
                month: 2,
                year: 2025,
                cost: 1111,
                name: 'Mobile'
              },
              {
                month: 2,
                year: 2025,
                cost: 3000,
                name: 'Refrigerator'
              },
            ],
            totalCost: 4111
        }
        testExpenses.forEach(exp => {
            addExpenseToList(exp);
        })
        let actual = generalProjectedMonthList.getMonth(2, 2025);
        expect(actual).toMatchObject(expected);
    })

    test('add add on expense for another month', () => {})
})