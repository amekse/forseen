import React, { useCallback, useState } from "react";
import "./common.styles.css";
import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Months } from "../types/common.types";
import { ExpenseItem } from "../types/expense.type";

enum FormKeys {
    itemName = 'itemName',
    cost = 'cost',
    priority = 'priority'
}

function Expense() {
    const priorityList = ['High','Medium','Low'];
    const [expenseForm, setExpenseForm] = useState<ExpenseItem>({
        itemName:'',
        cost:0,
        priority: 'low',
        itemDescription: ''
    })
    const [formError, setFormError] = useState('')

    const handleFormChange = useCallback((value:number|string, key:FormKeys) => {
        if (key === FormKeys.cost && typeof value === "number" && isNaN(value)) {
            setFormError('Please enter numbers only');
        } else {
            setFormError('');
            setExpenseForm(prev => ({
                ...prev,
                [key] : value
            }));
        }
    }, [])

    return (
        <div className="expenseContent">
            <div className="expenseLeftContainer">
                <div className="expenseEntryCard">
                    <Typography variant="h6" color="primary" fontWeight={800}>Add Expense</Typography>
                    <div className="inputRow">
                        <Typography variant="subtitle1" color="textPrimary">Item Name : </Typography>
                        <TextField variant="standard" value={expenseForm.itemName} onChange={e => } />
                    </div>
                    <div className="inputRow">
                        <Typography variant="subtitle1" color="textPrimary">Month & Year : </Typography>
                        <Select>
                            {
                                priorityList.map(priority => <MenuItem value={priority}>{priority}</MenuItem>)
                            }
                        </Select>
                    </div>
                    <div className="inputRow">
                        <Typography variant="subtitle1" color="textPrimary">Amount : </Typography>
                        <TextField variant="standard" />
                    </div>
                    <Typography variant="body2" color="error">{formError}</Typography>
                    <div className="cardEntryActions">
                        <Button onClick={_ => {}}>Clear</Button>
                        <Button onClick={_ => {}}>Save</Button>
                    </div>
                </div>
                <div className="expensePieChartContainer">

                </div>
            </div>
            <div className="expenseContainerRightWrap">
                <div className="expenseContainerRight">
                    3 columns for 3 types of expenses and 3 cards on top to show their total cost
                </div>
            </div>
        </div>
    )
}

export default Expense;