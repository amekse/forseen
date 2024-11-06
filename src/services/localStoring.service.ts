import { BudgetList } from "../types/budget.type";
import { GeneralProjectedList } from "../types/generalProjected.types";
import { logUntrackedError } from "../utils/logger.utils";

function setGeneralProjection(data:GeneralProjectedList) {
    localStorage.setItem('lastGenProj', JSON.stringify(data));
}

function getGeneralProjection():any {
    let jsonData:any = {};
    let data = localStorage.getItem('lastGenProjection') ?? "{}";
    try {
        jsonData = JSON.parse(data);
    } catch (e:any) {
        logUntrackedError('LocalStorage service general projection', e);
    }
    return jsonData;
}

function setBudgetList(data:BudgetList) {
    localStorage.setItem('lastBudgetList', JSON.stringify(data));
}

function getBudgetList():any {
    let jsonData:any = [];
    let data = localStorage.getItem('lastBudgetList') ?? "[]";
    try {
        jsonData = JSON.parse(data);
    } catch (e:any) {
        logUntrackedError('LocalStorage service budget list', e);
    }
    return jsonData;
}

export {
    getGeneralProjection,
    setGeneralProjection,
    getBudgetList,
    setBudgetList
}