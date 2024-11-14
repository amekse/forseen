import React, { useContext, useEffect, useState } from "react";
import ProjectionData from "../models/projection.model";
import { ExpenseItemI } from "../types/expense.type";
import { DataCleared } from "../common.contexts";
import { Typography, useTheme } from "@mui/material";
import { Gauge } from "@mui/x-charts";

type ShowData = {
    successfulExpense: ExpenseItemI[],
    failedExpense: ExpenseItemI[],
    leftOverflow: number,
    totalShortage: number,
    feasiblePercentage: number
}

function Projection() {
    const [showData, setShowData] = useState<ShowData>({
        successfulExpense: [],
        failedExpense: [],
        leftOverflow: 0,
        totalShortage: 0,
        feasiblePercentage: 0
    });

    const readyDisplayData = () => {
        const projectionData = (new ProjectionData()).projectForAll();
        console.log(projectionData.failedProjections.reduce((acc:number, cur) => acc += cur.cost, 0) )
        setShowData(prev => (
            {
                ...prev,
                successfulExpense: projectionData.successfulProjections,
                failedExpense: projectionData.failedProjections,
                leftOverflow: projectionData.projectionList.totalLeftOverBudget,
                totalShortage: projectionData.failedProjections.reduce((acc:number, cur) => acc += cur.cost, 0) - projectionData.projectionList.totalLeftOverBudget,
                feasiblePercentage: Math.round((projectionData.successfulProjections.length / (projectionData.failedProjections.length + projectionData.successfulProjections.length))*100)
            }
        ))
    }

    useEffect(() => {
        readyDisplayData();
    },[])

    const dataClearedContext = useContext(DataCleared);
    useEffect(() => {
        if (dataClearedContext > 0) {
            readyDisplayData();
        }
    }, [dataClearedContext])

    return (
        <div className="projectionContent">
            <div className="projectionQuickInfoSection">
                <div className="projectedQuickInfoTab">
                    <div className="inputRow">
                        <Typography variant="subtitle1" color="textPrimary">Leftover Budget: </Typography>
                        <Typography variant="h6" color="primary">{showData.leftOverflow}</Typography>
                    </div>
                    <Typography variant="caption" color="textSecondary">Budget left over after feasible expenses.</Typography>
                </div>
                <div className="projectedQuickInfoTab">
                    <div className="inputRow">
                        <Typography variant="subtitle1" color="textPrimary">Budget Shortage: </Typography>
                        <Typography variant="h6" color="primary">{showData.totalShortage}</Typography>
                    </div>
                    <Typography variant="caption" color="textSecondary">Net amount from items that didn't fit in the left over budget.</Typography>
                </div>
                <div className="projectedQuickInfoTab">
                    <div className="inputRow">
                        <div>
                            <Typography variant="subtitle1" color="textPrimary">Convertion Rate: </Typography>
                            <Typography variant="caption" color="textSecondary">Net percentage of purchasability out of total items.</Typography>
                        </div>
                        <Gauge value={showData.feasiblePercentage} startAngle={-90} endAngle={90} />
                    </div>
                </div>
            </div>
            <div className="projectionBreakDown">
                <div className="projectedListWrap">
                    <div className="projectedList">
                    </div>
                </div>
                <div className="projectedListWrap">
                    <div className="projectedList">
                    </div>
                </div>
                <div className="projectedCategoryGraphs">
                    <div className="projectedCategoryDistribution">

                    </div>
                    <div className="projectedCategoryDistribution">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Projection;