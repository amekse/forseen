import React, { useCallback, useState } from "react";
import "./common.styles.css";
import { Button, Snackbar, Tab, Tabs, Typography } from "@mui/material";
import { DeleteForever, EmojiPeople, Policy, QuestionMark } from "@mui/icons-material";
import Budget from "./Budget";
import Expense from "./Expense";
import Projection from "./Projection";
import { clearAllData } from "../services/common.services";
import { DataCleared } from "../common.contexts";

enum tabItems {
    budget = 'budget',
    expense = 'expense',
    projection = 'projection'
}

function Home() {
    const [selectedTab, selectTab] = useState(tabItems.budget);
    const [clearAllSnackbar, showClearAllSnackbar] = useState<boolean>(false);
    const [clearData, setClearData] = useState<number>(0);

    const handleTabChange = useCallback((event: React.SyntheticEvent, tabValue: string) => {
        selectTab(tabValue as tabItems);
    }, [])

    const handleClearMemory = () => {
        setClearData(Date.now());
        clearAllData();
        showClearAllSnackbar(true);
    }

    const handleShowGuide = () => window.open(`${window.location.origin}/guide.html`);

    return (
        <DataCleared.Provider value={clearData}>
            <div className="home">
                <div className="heading">
                    <Typography variant="h5" color="textPrimary">Foresee</Typography>
                    <div className="quickLinks">
                        <Button color="primary" variant="contained" startIcon={<QuestionMark />} onClick={handleShowGuide}>Guide</Button>
                        <Button color="primary" variant="contained" startIcon={<EmojiPeople />}>About Us</Button>
                        <Button color="primary" variant="contained" startIcon={<Policy />}>Policies</Button>
                        <Button color="error" variant="contained" startIcon={<DeleteForever />} onClick={handleClearMemory}>Clear Memory</Button>
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
                <Snackbar
                    open={clearAllSnackbar}
                    autoHideDuration={6000}
                    message={<div className="snackbarMessage"><DeleteForever color="success" /><Typography variant="subtitle1" color="success">Memory successfully cleared</Typography></div>}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    onClose={_ => {showClearAllSnackbar(false)}}
                />
            </div>
        </DataCleared.Provider>
    )
}

export default Home;