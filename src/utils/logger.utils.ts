function logError(trackMessage: string, data: string[], error?: any) {
    console.error(trackMessage, data, error);
}

function logUntrackedError(trackMessage: string, data: any) {
    console.error(trackMessage, data);
}

export { 
    logError,
    logUntrackedError
}