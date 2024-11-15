import React, { useContext, useEffect, useState } from "react";
import ProjectionData from "../models/projection.model";
import { ExpenseItemI } from "../types/expense.type";
import { DataCleared } from "../common.contexts";
import { Typography } from "@mui/material";
import { Gauge, PieChart } from "@mui/x-charts";

type PieData = {label:string,value:number}[]

type ShowData = {
    successfulExpense: ExpenseItemI[],
    failedExpense: ExpenseItemI[],
    leftOverflow: number,
    totalShortage: number,
    feasiblePercentage: number,
    pieDataSuccess: PieData,
    pieDataFail: PieData
}

function Projection() {
    const [showData, setShowData] = useState<ShowData>({
        successfulExpense: [],
        failedExpense: [],
        leftOverflow: 0,
        totalShortage: 0,
        feasiblePercentage: 0,
        pieDataFail: [],
        pieDataSuccess: []
    });

    const calculatePieDistribution = (itemsList: ExpenseItemI[]):PieData => {
        let highCount = 0, mediumCount = 0, lowCount = 0;
        itemsList.forEach(item => {
            switch(item.priority) {
                case "high": highCount += 1; break;
                case "medium": mediumCount += 1; break;
                case "low": lowCount += 1; break;
            }
        });
        const totalCount = highCount + mediumCount + lowCount;
        return [
            {
                label: 'High',
                value: Math.round((highCount/totalCount)*100)
            },
            {
                label: 'Medium',
                value: Math.round((mediumCount/totalCount)*100)
            },
            {
                label: 'Low',
                value: Math.round((lowCount/totalCount)*100)
            }
        ]
    }

    const readyDisplayData = () => {
        const projectionData = (new ProjectionData()).projectForAll();
        setShowData(prev => (
            {
                ...prev,
                successfulExpense: projectionData.successfulProjections,
                failedExpense: projectionData.failedProjections,
                leftOverflow: projectionData.projectionList.totalLeftOverBudget,
                totalShortage: projectionData.failedProjections.reduce((acc:number, cur) => acc += cur.cost, 0) - projectionData.projectionList.totalLeftOverBudget,
                feasiblePercentage: Math.round((projectionData.successfulProjections.length / (projectionData.failedProjections.length + projectionData.successfulProjections.length))*100),
                pieDataSuccess: calculatePieDistribution(projectionData.successfulProjections),
                pieDataFail: calculatePieDistribution(projectionData.failedProjections)
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
                    <div>
                        <Typography variant="h6" color="primary">Feasible Items</Typography>
                        <Typography variant="caption" color="textSecondary">List of items that fits in the budget</Typography>
                    </div>
                    <div className="projectedList">
                        {
                            showData.successfulExpense.map(scsItem => 
                                <div className="projectedItemCard">
                                    <Typography variant="h6" color="primary">{scsItem.itemName}</Typography>
                                    <Typography variant="subtitle1" color="textPrimary">Price: {scsItem.cost}</Typography>
                                    <Typography variant="subtitle2" color="textPrimary">Priority: {scsItem.priority.toUpperCase()}</Typography>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="projectedListWrap">
                    <div>
                        <Typography variant="h6" color="primary">Unattainable Items</Typography>
                        <Typography variant="caption" color="textSecondary">List of items that doesn't fit in the budget</Typography>
                    </div>
                    <div className="projectedList">
                        {
                            showData.failedExpense.map(flItem => 
                                <div className="projectedItemCard">
                                    <Typography variant="h6" color="primary">{flItem.itemName}</Typography>
                                    <Typography variant="subtitle1" color="textPrimary">Price: {flItem.cost}</Typography>
                                    <Typography variant="subtitle2" color="textPrimary">Priority: {flItem.priority.toUpperCase()}</Typography>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="projectedCategoryGraphs">
                    <div className="projectedCategoryDistribution">
                        <Typography variant="subtitle1" color="primary">Category Distribution of Feasible Items</Typography>
                        <PieChart
                            series={[{
                                data: showData.pieDataSuccess
                            }]}
                            slotProps={{
                                legend: {
                                    hidden: true
                                }
                            }}
                        />
                    </div>
                    <div className="projectedCategoryDistribution">
                        <Typography variant="subtitle1" color="primary">Category Distribution of Unattainable Items</Typography>
                        <PieChart
                            series={[{
                                data: showData.pieDataFail
                            }]}
                            slotProps={{
                                legend: {
                                    hidden: true
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Projection;