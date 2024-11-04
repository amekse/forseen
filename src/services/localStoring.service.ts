import { GeneralProjectedList } from "../types/generalProjected.types";

function setGeneralProjection(data:GeneralProjectedList) {
    localStorage.setItem('lastGenProj', JSON.stringify(data));
}

function getGeneralProjection():any {
    let jsonData:any = {};
    let data = localStorage.getItem('lastGenProjection') ?? "{}";
    jsonData = JSON.parse(data);
    return jsonData;
}

export {
    getGeneralProjection,
    setGeneralProjection
}