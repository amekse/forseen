import React, { useCallback, useState } from "react";
import "./common.styles.css";
import { Button, Tab, Tabs, Typography } from "@mui/material";
import { EmojiPeople, Policy, QuestionMark } from "@mui/icons-material";
import Budget from "./Budget";
import Expense from "./Expense";
import Projection from "./Projection";

enum tabItems {
    budget = 'budget',
    expense = 'expense',
    projection = 'projection'
}

function Home() {
    const [selectedTab, selectTab] = useState(tabItems.budget);

    const handleTabChange = useCallback((event: React.SyntheticEvent, tabValue: string) => {
        selectTab(tabValue as tabItems);
    }, [])

    return (
        <div className="home">
            <div className="heading">
                <Typography variant="h5" color="textPrimary">Foresee</Typography>
                <div className="quickLinks">
                    <Button color="primary" variant="contained" startIcon={<QuestionMark />}>Guide</Button>
                    <Button color="primary" variant="contained" startIcon={<EmojiPeople />}>About Us</Button>
                    <Button color="primary" variant="contained" startIcon={<Policy />}>Policies</Button>
                </div>
            </div>
            <div className="content">
                <Tabs textColor="primary" indicatorColor="primary" value={selectedTab} onChange={handleTabChange}>
                    <Tab value={tabItems.budget} label="Budgets" />
                    <Tab value={tabItems.expense} label="Expenses" />
                    <Tab value={tabItems.projection} label="Projection" />
                </Tabs>
                <div className="tabContent">
                    { selectedTab === tabItems.budget ? <Budget /> : null }
                    { selectedTab === tabItems.expense ? <Expense /> : null }
                    { selectedTab === tabItems.projection ? <Projection /> : null }
                </div>
            </div>
        </div>
    )
}

export default Home;