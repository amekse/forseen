import { ErrorMessages } from "../types/common.types";

function logError(trackMessage: string, data: ErrorMessages, error?: any) {
    console.error(trackMessage, data, error);
}

function logUntrackedError(trackMessage: string, data: any) {
    console.error(trackMessage, data);
}

export { 
    logError,
    logUntrackedError
}