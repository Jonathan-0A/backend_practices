export const renameFields = (data) => {
    if (!data || typeof data !== "object") return data;
    const fieldMapping = {
        serial_id: "id",
        family_code: "fc_no",
        rittwik_name: "rittwik",
        adhaar_number: "adhaar",
        pan_car_number: "pan",
        phone_number: "phone", 
    };
    const renamedData = {};
    Object.keys(data).forEach((key) => {
        const newKey = fieldMapping[key] || key; // Default to original key if no mapping exists
        renamedData[newKey] = data[key];
    });

    return renamedData;
};
export const getHeaders = async (googleSheets, sheetId) => {
    const headerResponse = await googleSheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "infoDatabase!A1:Z1",
    });
    const headers = headerResponse.data.values?.[0];
    if (!headers) {
        throw new Error("No headers found in the spreadsheet. Please ensure the first row contains headers.");
    }
    return headers;
};
export const getPaginatedRows = async (googleSheets, sheetId, startRow, pageSize) => {
    const range = `infoDatabase!A${startRow}:Z${startRow + pageSize - 1}`;
    const dataResponse = await googleSheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
    });
    return dataResponse.data.values || [];
};