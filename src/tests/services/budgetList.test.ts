import budgetData from "../../models/budget.model"
import ExpenseData from "../../models/expenseData.model"
import { clearAllData } from "../../services/common.services"
import { addExpenseToList } from "../../services/generalProjection.service"
import { BudgetForMonth, BudgetForPeriod, BudgetList } from "../../types/budget.type"

describe('budget list', () => {
    const testExpense = new ExpenseData({
        itemName: "Mobile",
        cost: 4200,
        saveDateStart: {
            month: 1,
            year: 2025
        },
        saveDateEnd: {
            month: 3,
            year: 2025
        }
    })

    const testBudgetForMonth:BudgetForMonth = {
        month: 1,
        year: 2025,
        amount: 1000
    }

    const testBudgetAverage:BudgetForPeriod = {
        startMonth: 2,
        endMonth: 3,
        startYear: 2025,
        endYear: 2025,
        amount: 1500
    }

    beforeAll(() => {
        clearAllData();
    })

    afterAll(() => {
        clearAllData();
    })

    test('add average leaving last month', () => {
        const expected:BudgetList = {
            totalExtraCost: 0,
            "202502": {
                month: 2,
                year: 2025,
                amount: 1500,
                extraAmount: 0,
                availableAdjustment: 1500,
                adjustAmount: 0
            },
            "202503": {
                month: 3,
                year: 2025,
                amount: 1500,
                extraAmount: 0,
                availableAdjustment: 1500,
                adjustAmount: 0
            }
        }

        budgetData.addAverage(testBudgetAverage);
        expect(budgetData.getFull()).toEqual(expected);
    })

    test('add expense data and check buget output', () => {
        const expected:BudgetList = {
            totalExtraCost: 1400,
            "202501": {
                month: 1,
                year: 2025,
                amount: 0,
                extraAmount: 1400,
                availableAdjustment: 0,
                adjustAmount: 0
            },
            "202502": {
                month: 2,
                year: 2025,
                amount: 1500,
                extraAmount: 0,
                availableAdjustment: 100,
                adjustAmount: 0
            },
            "202503": {
                month: 3,
                year: 2025,
                amount: 1500,
                extraAmount: 0,
                availableAdjustment: 100,
                adjustAmount: 0
            }
        }
        addExpenseToList(testExpense);
        expect(budgetData.getFull()).toEqual(expected);
    })

    test ('add budget for non-existing month and check', () => {
        const expected:BudgetList = {
            totalExtraCost: 400,
            "202501": {
                month: 1,
                year: 2025,
                amount: 1000,
                extraAmount: 400,
                availableAdjustment: 0,
                adjustAmount: 0
            },
            "202502": {
                month: 2,
                year: 2025,
                amount: 1500,
                extraAmount: 0,
                availableAdjustment: 100,
                adjustAmount: 0
            },
            "202503": {
                month: 3,
                year: 2025,
                amount: 1500,
                extraAmount: 0,
                availableAdjustment: 100,
                adjustAmount: 0
            }
        }
        budgetData.addForMonth(testBudgetForMonth);
        expect(budgetData.getFull()).toEqual(expected);
    })
})