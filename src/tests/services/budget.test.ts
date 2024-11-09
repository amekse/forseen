import budgetData from "../../models/budget.model"
import { clearAllData } from "../../services/common.services"
import { AverageBudget, BudgetForMonth, BudgetList } from "../../types/budget.type"

describe('test budget add and read', () => {
    const testMonthsBudget:BudgetForMonth[] = [
        {
            month: 9,
            year: 2024,
            amount: 1000
        },
        {
            month: 10,
            year: 2024,
            amount: 2000
        }
    ]

    const testAverageBudget:AverageBudget = {
        startMonth: 11,
        endMonth: 2,
        startYear: 2024,
        endYear: 2025,
        amount: 1500
    }

    beforeAll(() => {
        budgetData.addBudgetForMonthsList(testMonthsBudget);
        budgetData.addAverageBudgetForMonths(testAverageBudget);
    })
    
    afterAll(() => {
        clearAllData();
    })

    test('get budget full period', () => {
        const expected:BudgetList = {
            202409: {
                month: 9,
                year: 2024,
                amount: 1000
            },
            202410: {
                month: 10,
                year: 2024,
                amount: 2000
            },
            202411: {
                month: 11,
                year: 2024,
                amount: 1500
            },
            202412: {
                month: 12,
                year: 2024,
                amount: 1500
            },
            202501: {
                month: 1,
                year: 2025,
                amount: 1500
            },
            202502: {
                month: 2,
                year: 2025,
                amount: 1500
            }
        }

        const actual = budgetData.getBudgetFull();

        expect(actual).toEqual(expected);
    })

    test('budget get for month', () => {
        const expected:BudgetForMonth = {
            month: 1,
            year: 2025,
            amount: 1500
        }

        const actual = budgetData.getBudgetMonth(1, 2025);

        expect(actual).toEqual(expected);
    })
})