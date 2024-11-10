import budgetData from "../../models/budget.model"
import expenseData from "../../models/expense.model"
import ProjectionData from "../../models/projection.model"
import { AverageBudget, BudgetForMonth } from "../../types/budget.type"
import { ExpenseItem } from "../../types/expense.type"
import { ProjectedDetails } from "../../types/projection.types"

describe('test projection read', () => {
    const testExpensesList:ExpenseItem[] = [
        {
            itemName: "Television",
            itemDescription: "",
            cost: 2000,
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
            cost: 6000,
            priority: 'medium'
        }
    ]

    const testMonthsBudget:BudgetForMonth[] = [
        {
            month: 12,
            year: 2024,
            amount: 4000
        },
        {
            month: 1,
            year: 2025,
            amount: 2000
        }
    ]

    const testAverageBudget:AverageBudget = {
        startMonth: 2,
        endMonth: 4,
        startYear: 2025,
        endYear: 2025,
        amount: 2000
    }

    beforeAll(() => {
        budgetData.addBudgetForMonthsList(testMonthsBudget);
        budgetData.addAverageBudgetForMonths(testAverageBudget);
        testExpensesList.forEach(expense => {
            expenseData.addExpense(expense);
        })
    })

    test('get projection', () => {
        const expected:ProjectedDetails = {
            "errorList": [
              "Not enough budget for Television, please add more budget to cover the amount 2000"
            ],
            "projectionList": {
              "202412": {
                "month": 12,
                "year": 2024,
                "amount": 0,
                "usedAmount": 4000,
                "expensesItem": [
                  {
                    "itemName": "Fridge",
                    "itemDescription": "",
                    "cost": 5000,
                    "priority": "high",
                    "id": ""
                  }
                ]
              },
              "202501": {
                "month": 1,
                "year": 2025,
                "amount": 0,
                "usedAmount": 2000,
                "expensesItem": [
                  {
                    "itemName": "Fridge",
                    "itemDescription": "",
                    "cost": 5000,
                    "priority": "high",
                    "id": ""
                  },
                  {
                    "itemName": "Mobile",
                    "itemDescription": "",
                    "cost": 6000,
                    "priority": "medium",
                    "id": ""
                  }
                ]
              },
              "202502": {
                "month": 2,
                "year": 2025,
                "amount": 0,
                "usedAmount": 2000,
                "expensesItem": [
                  {
                    "itemName": "Mobile",
                    "itemDescription": "",
                    "cost": 6000,
                    "priority": "medium",
                    "id": ""
                  }
                ]
              },
              "202503": {
                "month": 3,
                "year": 2025,
                "amount": 0,
                "usedAmount": 2000,
                "expensesItem": [
                  {
                    "itemName": "Mobile",
                    "itemDescription": "",
                    "cost": 6000,
                    "priority": "medium",
                    "id": ""
                  }
                ]
              },
              "202504": {
                "month": 4,
                "year": 2025,
                "amount": 1000,
                "usedAmount": 1000,
                "expensesItem": [
                  {
                    "itemName": "Mobile",
                    "itemDescription": "",
                    "cost": 6000,
                    "priority": "medium",
                    "id": ""
                  }
                ]
              },
              "monthYears": [
                202412,
                202501,
                202502,
                202503,
                202504
              ],
              "totalLeftOverBudget": 0
            }
        }

        const projectionData = new ProjectionData();
        let actual = projectionData.projectForAll();
        actual.projectionList.monthYears.forEach(monthYear => {
            actual.projectionList[monthYear].expensesItem.forEach(expense => {
                expense.id = ''
            })
        })

        expect(actual).toEqual(expected);
    })
})