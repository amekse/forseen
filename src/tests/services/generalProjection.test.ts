import ExpenseData from "../../models/expenseData.model"
import generalProjectedMonthList from "../../models/generalProjectedMonthList.model"
import { addExpenseToList } from "../../services/generalProjection.service"

describe('general projection', () => {
    const testExpenses = [
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

    // test('single expense for month', () => {
    //     const expected = {
    //         items: [
    //           {
    //             month: 12,
    //             year: 2024,
    //             cost: 1111,
    //             name: 'Mobile'
    //           }
    //         ],
    //         totalCost: 1111
    //     }

    //     addExpenseToList(testExpenses[0]);
    //     let actual = generalProjectedMonthList.getMonth(12, 2024);
    //     expect(actual).toMatchObject(expected);
    // })

    test('multiple expense for month', () => {
        const expected = {
            items: [
              {
                month: 12,
                year: 2024,
                cost: 1111,
                name: 'Mobile'
              },
              {
                month: 12,
                year: 2024,
                cost: 3000,
                name: 'Refrigerator'
              },
            ],
            totalCost: 4111
        }

        testExpenses.forEach(exp => {
            addExpenseToList(exp);
        })
        let actual = generalProjectedMonthList.getMonth(12, 2024);
        console.log(actual)
        expect(actual).toMatchObject(expected);
    })
})