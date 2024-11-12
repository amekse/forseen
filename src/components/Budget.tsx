import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, IconButton, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import { AverageBudget, BudgetForMonth } from "../types/budget.type";
import { Months } from "../types/common.types";
import budgetData from "../models/budget.model";
import { LineChart } from '@mui/x-charts';
import { DeleteOutline } from "@mui/icons-material";

enum FormKeys {
    month = 'month',
    year = 'year',
    amount = 'amount',
    startMonth = 'startMonth',
    endMonth = 'endMonth',
    startYear = 'startYear',
    endYear = 'endYear'
}

function Budget() {
    const [saveTriggered, triggerSave] = useState<number>(0);
    const theme = useTheme();
    const monthsList:Months[] = [1,2,3,4,5,6,7,8,9,10,11,12];
    const monthsNameList:string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yearsList:number[] = Array.from({ length: 3000 - 2024 + 1 }, (_, i) => 2024 + i);
    const [monthBudget, setMonthBudget] = useState<BudgetForMonth>({
        month: (new Date()).getMonth()+1 as Months,
        year: (new Date()).getFullYear(),
        amount: 0
    });
    const [averageBudget, setAverageBudget] = useState<AverageBudget>({
        startMonth: (new Date()).getMonth()+1 as Months,
        startYear: (new Date()).getFullYear(),
        endMonth: (new Date()).getMonth()+1 as Months,
        endYear: (new Date()).getFullYear()+1,
        amount: 0
    })
    const [inputError, setInputError] = useState({
        monthBudget: '',
        averageBudget: ''
    })

    const handleMonthBudgetChange = useCallback((value:number|Months, key:FormKeys) => {
        if (key === FormKeys.amount && isNaN(value)) {
            setInputError(prev => ({
                ...prev,
                monthBudget: 'Please enter numbers only'
            }))
        } else {
            setInputError(prev => ({
                ...prev,
                monthBudget: ''
            }))
            setMonthBudget(prev => ({
                ...prev,
                [key] : value
            }))
        }
    }, [])

    const handleAverageBudgetChange = useCallback((value:number|Months, key:FormKeys) => {
        if (key === FormKeys.amount && isNaN(value)) {
            setInputError(prev => ({
                ...prev,
                averageBudget: 'Please enter numbers only'
            }))
        } else {
            setInputError(prev => ({
                ...prev,
                averageBudget: ''
            }))
            setAverageBudget(prev => ({
                ...prev,
                [key] : value
            }))
        }
    }, [])

    const handleSave = (budgetType: 'month' | 'average') => {
        if (budgetType === 'month') {
            budgetData.addBudgetForMonthsList([monthBudget]);
            clearData('month');
        }
        if (budgetType === 'average') {
            budgetData.addAverageBudgetForMonths(averageBudget);
            clearData('average');
        }
        triggerSave(Date.now());
    }

    const clearData = (budgetType: 'month' | 'average') => {
        if (budgetType === 'month') {
            setMonthBudget({
                month: (new Date()).getMonth()+1 as Months,
                year: (new Date()).getFullYear(),
                amount: 0
            });
        }
        if (budgetType === 'average') {
            setAverageBudget({
                startMonth: (new Date()).getMonth()+1 as Months,
                startYear: (new Date()).getFullYear(),
                endMonth: (new Date()).getMonth()+1 as Months,
                endYear: (new Date()).getFullYear()+1,
                amount: 0
            });
        }
        setInputError(_ => ({
            monthBudget: '',
            averageBudget: ''
        }))
    }

    const chartXAxisData:string[] = useMemo(() => {
        const monthYears = budgetData.getBudgetMonthYears();
        let xAxisData:string[] = [''];
        monthYears.forEach(monthYear => {
            let month = monthYear%100;
            let year = Math.trunc(monthYear/100);
            xAxisData.push(`${month}-${year}`);
        })
        return xAxisData;
    }, [saveTriggered])

    const chartBarData:{data: number[]}[] = useMemo(() => {
        let chartData:number[]= [0]
        const monthYears = budgetData.getBudgetMonthYears();
        monthYears.forEach(monthYear => {
            let budgetForMonth = budgetData.getBudgetMonthById(monthYear);
            chartData.push(budgetForMonth.amount)
        })
        return [{data: chartData, color: theme.palette.primary.main}];
    }, [saveTriggered])

    const budgetList:BudgetForMonth[] = useMemo(() => {
        let tempList:BudgetForMonth[] = [];
        budgetData.getBudgetMonthYears().forEach(monthYear => {
            tempList.push(budgetData.getBudgetMonthById(monthYear));
        })
        return tempList;
    }, [saveTriggered])

    useEffect(() => {
        triggerSave(Date.now());
    },[])

    return (
        <div className="budgetContent">
            <div className="budgetLeftContainer">
                <div className="budgetLeftTop">
                    <div className="budgetEntryCard" key="budgetEntryCardMonth">
                        <Typography variant="h6" color="primary" fontWeight={800}>Add Month's Budget</Typography>
                        <div className="inputRow">
                            <Typography variant="subtitle1" color="textPrimary">Month & Year : </Typography>
                            <Select value={monthBudget.month} onChange={e => handleMonthBudgetChange(e.target.value as Months, FormKeys.month)}>
                                {
                                    monthsList.map(cMth => <MenuItem key={`${monthsNameList[cMth-1]}`} value={cMth}>{cMth} {`(${monthsNameList[cMth-1]})`}</MenuItem>)
                                }
                            </Select>
                            <Select value={monthBudget.year} onChange={e => handleMonthBudgetChange(e.target.value as number, FormKeys.year)}>
                                {
                                    yearsList.map(cYr => <MenuItem key={`monthbudget-${cYr}`} value={cYr}>{cYr}</MenuItem>)
                                }
                            </Select>
                        </div>
                        <div className="inputRow">
                            <Typography variant="subtitle1" color="textPrimary">Amount : </Typography>
                            <TextField value={monthBudget.amount} variant="standard" onChange={e => handleMonthBudgetChange(Number(e.target.value), FormKeys.amount)} />
                        </div>
                        <Typography variant="body2" color="error">{inputError.monthBudget}</Typography>
                        <div className="budgetEntryActions">
                            <Button onClick={_ => clearData('average')}>Clear</Button>
                            <Button onClick={_ => handleSave('month')}>Save</Button>
                        </div>
                    </div>
                    <div className="budgetEntryCard" key="budgetEntryCardAverage">
                        <Typography variant="h6" color="primary" fontWeight={800}>Add Average Budget</Typography>
                        <div className="inputRow">
                            <Typography variant="subtitle1" color="textPrimary">Start Month & Year : </Typography>
                            <Select value={averageBudget.startMonth} onChange={e => handleAverageBudgetChange(e.target.value as Months, FormKeys.startMonth)}>
                                {
                                    monthsList.map(cMth => <MenuItem key={`avgstartmnth${monthsNameList[cMth-1]}`} value={cMth}>{cMth} {`(${monthsNameList[cMth-1]})`}</MenuItem>)
                                }
                            </Select>
                            <Select value={averageBudget.startYear} onChange={e => handleAverageBudgetChange(e.target.value as number, FormKeys.startYear)}>
                                {
                                    yearsList.map(cYr => <MenuItem key={`avgstart${cYr}`} value={cYr}>{cYr}</MenuItem>)
                                }
                            </Select>
                        </div>
                        <div className="inputRow">
                            <Typography variant="subtitle1" color="textPrimary">End Month & Year : </Typography>
                            <Select value={averageBudget.endMonth} onChange={e => handleAverageBudgetChange(e.target.value as Months, FormKeys.endMonth)}>
                                {
                                    monthsList.map(cMth => <MenuItem key={`avgendmnth${monthsNameList[cMth-1]}`} value={cMth}>{cMth} {`(${monthsNameList[cMth-1]})`}</MenuItem>)
                                }
                            </Select>
                            <Select value={averageBudget.endYear} onChange={e => handleAverageBudgetChange(e.target.value as number, FormKeys.endYear)}>
                                {
                                    yearsList.map(cYr => <MenuItem key={`avgendyr${cYr}`} value={cYr}>{cYr}</MenuItem>)
                                }
                            </Select>
                        </div>
                        <div className="inputRow">
                            <Typography variant="subtitle1" color="textPrimary">Amount : </Typography>
                            <TextField value={averageBudget.amount} variant="standard" onChange={e => handleAverageBudgetChange(Number(e.target.value), FormKeys.amount)} />
                        </div>
                        <Typography variant="body2" color="error">{inputError.averageBudget}</Typography>
                        <div className="budgetEntryActions">
                            <Button onClick={_ => clearData('average')}>Clear</Button>
                            <Button onClick={_ => handleSave('average')}>Save</Button>
                        </div>
                    </div>
                </div>
                <div className="budgetLeftBottom">
                    <Typography variant="h6" color="primary" fontWeight={800}>Budget Trend:</Typography>
                    <LineChart 
                        xAxis={[{scaleType: 'band', data: chartXAxisData}]}
                        series={chartBarData}
                    />
                </div>
            </div>
            <div className="budgetContainerRightWrap">
                <Typography variant="h6" color="primary" fontWeight={800}>Present Budget:</Typography>
                <div className="budgetContainerRight">
                    {
                        budgetList.map(showData => {
                            return (
                                <div className="budgetListCard" key={`${showData.month}${showData.year}`}>
                                    <div className="budgetListCardData">
                                        <Typography variant="subtitle1" color="primary">Month: {monthsNameList[showData.month-1]}, {showData.year}</Typography>
                                        <Typography variant="subtitle1" color="textPrimary">Amount: {showData.amount}</Typography>
                                    </div>
                                    <IconButton color="error"><DeleteOutline /></IconButton>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Budget;