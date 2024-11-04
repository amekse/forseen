import { GeneralProjectedList } from "../types/generalProjected.types";

// TODO: error handling for set

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