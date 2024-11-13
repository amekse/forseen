import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./common.styles.css";
import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ExpenseItem } from "../types/expense.type";
import expenseData from "../models/expense.model";
import { DataCleared } from "../common.contexts";
import { PieChart } from "@mui/x-charts";

enum FormKeys {
    itemName = 'itemName',
    cost = 'cost',
    priority = 'priority'
}

function Expense() {
    const priorityList = ['high','medium','low'];
    const [saveTriggered, triggerSave] = useState<number>(0);
    const [expenseForm, setExpenseForm] = useState<ExpenseItem>({
        itemName:'',
        cost:0,
        priority: 'low',
        itemDescription: ''
    })
    const [formError, setFormError] = useState('')

    const handleFormChange = useCallback((value:number|string, key:FormKeys) => {
        if (key === FormKeys.cost && isNaN(Number(value))) {
            setFormError('Please enter numbers only');
        } else {
            setFormError('');
            setExpenseForm(prev => ({
                ...prev,
                [key] : value
            }));
        }
    }, [])

    const clearFormData = () => {
        setFormError('');
        setExpenseForm(_ => ({
            itemName:'',
            cost:0,
            priority: 'low',
            itemDescription: ''
        }));
    }

    const saveFormData = () => {
        expenseData.addExpense(expenseForm);
        triggerSave(Date.now());
        clearFormData();
    }

    const expenseShowData = useMemo(() => {
        let netHigh = expenseData.getExpenseCategoryList().high.reduce((acc:number, cur) => acc += cur.cost, 0);
        let netMedium = expenseData.getExpenseCategoryList().medium.reduce((acc:number, cur) => acc += cur.cost, 0);
        let netLow = expenseData.getExpenseCategoryList().low.reduce((acc:number, cur) => acc += cur.cost, 0);
        let pieData:{label:string,value:number}[] = expenseData.getExpensesList().map(expItem => {
            return {
                label: `${expItem.itemName} - ${expItem.cost}`,
                value: Math.round((expItem.cost/(netHigh+netLow+netMedium))*100)
            }
        })
        let showData = {
            high: expenseData.getExpenseCategoryList().high,
            medium: expenseData.getExpenseCategoryList().medium,
            low: expenseData.getExpenseCategoryList().low,
            netHigh,
            netMedium,
            netLow,
            pieData
        }
        return showData;
    }, [saveTriggered])

    useEffect(() => {
        triggerSave(Date.now());
    },[])

    const dataClearedContext = useContext(DataCleared);
    useEffect(() => {
        if (dataClearedContext > 0) {
            triggerSave(Date.now());
        }
    }, [dataClearedContext])

    return (
        <div className="expenseContent">
            <div className="expenseLeftContainer">
                <div className="expenseEntryCard">
                    <Typography variant="h6" color="primary" fontWeight={800}>Add Expense</Typography>
                    <div className="inputRow">
                        <Typography variant="subtitle1" color="textPrimary">Item Name : </Typography>
                        <TextField variant="standard" value={expenseForm.itemName} onChange={e => handleFormChange(e.target.value, FormKeys.itemName)} />
                    </div>
                    <div className="inputRow">
                        <Typography variant="subtitle1" color="textPrimary">Priority : </Typography>
                        <Select value={expenseForm.priority} onChange={e => handleFormChange(e.target.value as string, FormKeys.priority)} >
                            {
                                priorityList.map(priority => <MenuItem value={priority}>{priority.toUpperCase()}</MenuItem>)
                            }
                        </Select>
                    </div>
                    <div className="inputRow">
                        <Typography variant="subtitle1" color="textPrimary">Amount : </Typography>
                        <TextField variant="standard" value={expenseForm.cost} onChange={e => handleFormChange(Number(e.target.value), FormKeys.cost)}  />
                    </div>
                    <Typography variant="body2" color="error">{formError}</Typography>
                    <div className="cardEntryActions">
                        <Button onClick={_ => {clearFormData()}}>Clear</Button>
                        <Button onClick={_ => {saveFormData()}}>Save</Button>
                    </div>
                </div>
                <div className="expensePieChartContainer">
                    <Typography variant="h6" color="primary" fontWeight={800} className="expenseListHeading">Expense Distribution:</Typography>
                    <PieChart
                        series={[{
                            data: expenseShowData.pieData
                        }]}
                        slotProps={{
                            legend: {
                                hidden: true
                            }
                        }}
                    />
                </div>
            </div>
            <div className="expenseContainerRightWrap">
                <div className="expenseContainerRight">
                    <div className="expenseContainerRightTop">
                        <div className="expenseTotalCardWrapper">
                            <div className="expenseTotalCard">
                                <Typography variant="subtitle1" color="textPrimary">Net High Priority:</Typography>
                                <Typography variant="h6" color="primary" fontWeight={600}>{expenseShowData.netHigh}</Typography>
                            </div>
                        </div>
                        <div className="expenseTotalCardWrapper">
                            <div className="expenseTotalCard">
                                <Typography variant="subtitle1" color="textPrimary">Net Medium Priority:</Typography>
                                <Typography variant="h6" color="primary" fontWeight={600}>{expenseShowData.netMedium}</Typography>
                            </div>
                        </div>
                        <div className="expenseTotalCardWrapper">
                            <div className="expenseTotalCard">
                                <Typography variant="subtitle1" color="textPrimary">Net Low Priority:</Typography>
                                <Typography variant="h6" color="primary" fontWeight={600}>{expenseShowData.netLow}</Typography>
                            </div>
                        </div>
                    </div>
                    <div className="expenseContainerRightBottom">
                        <div className="expenseListWrapper">
                            <Typography variant="h6" color="primary" fontWeight={800} className="expenseListHeading">High:</Typography>
                            <div className="expenseList">
                                {
                                    expenseShowData.high.map(highItem =>
                                        <div className="expenseDataCard" key={highItem.id}>
                                            <div className="inputRow">
                                                <Typography variant="subtitle1" color="primary">Item Name:</Typography>
                                                <Typography variant="subtitle1" color="primary" fontWeight={800}>{highItem.itemName}</Typography>
                                            </div>
                                            <div className="inputRow">
                                                <Typography variant="subtitle1" color="textPrimary">Cost:</Typography>
                                                <Typography variant="subtitle1" color="textPrimary">{highItem.cost}</Typography>
                                            </div>
                                            <div className="inputRow">
                                                <Typography variant="subtitle1" color="textPrimary">Priority:</Typography>
                                                <Typography variant="subtitle1" color="textPrimary">{highItem.priority.toUpperCase()}</Typography>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="expenseListWrapper">
                            <Typography variant="h6" color="primary" fontWeight={800} className="expenseListHeading">Medium:</Typography>
                            <div className="expenseList">
                                {
                                    expenseShowData.medium.map(mediumItem =>
                                        <div className="expenseDataCard" key={mediumItem.id}>
                                            <div className="inputRow">
                                                <Typography variant="subtitle1" color="primary">Item Name:</Typography>
                                                <Typography variant="subtitle1" color="primary" fontWeight={800}>{mediumItem.itemName}</Typography>
                                            </div>
                                            <div className="inputRow">
                                                <Typography variant="subtitle1" color="textPrimary">Cost:</Typography>
                                                <Typography variant="subtitle1" color="textPrimary">{mediumItem.cost}</Typography>
                                            </div>
                                            <div className="inputRow">
                                                <Typography variant="subtitle1" color="textPrimary">Priority:</Typography>
                                                <Typography variant="subtitle1" color="textPrimary">{mediumItem.priority.toUpperCase()}</Typography>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="expenseListWrapper">
                            <Typography variant="h6" color="primary" fontWeight={800} className="expenseListHeading">Low:</Typography>
                            <div className="expenseList">
                                {
                                    expenseShowData.low.map(lowItem =>
                                        <div className="expenseDataCard" key={lowItem.id}>
                                            <div className="inputRow">
                                                <Typography variant="subtitle1" color="primary">Item Name:</Typography>
                                                <Typography variant="subtitle1" color="primary" fontWeight={800}>{lowItem.itemName}</Typography>
                                            </div>
                                            <div className="inputRow">
                                                <Typography variant="subtitle1" color="textPrimary">Cost:</Typography>
                                                <Typography variant="subtitle1" color="textPrimary">{lowItem.cost}</Typography>
                                            </div>
                                            <div className="inputRow">
                                                <Typography variant="subtitle1" color="textPrimary">Priority:</Typography>
                                                <Typography variant="subtitle1" color="textPrimary">{lowItem.priority.toUpperCase()}</Typography>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Expense;