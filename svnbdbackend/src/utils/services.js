export const getAllData = async (googleSheets, sheetId, sheetName="infoDatabase", startRow=2) => {
    const range = `${sheetName}!A${startRow}:Z`;
    const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
    });
    return response.data.values || [];
};