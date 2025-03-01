import { google } from 'googleapis';
import { promisify } from 'util';
import fs from 'fs';

const readFile = promisify(fs.readFile);

export const initializeGoogleSheets = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: authClient });
    return googleSheets;
};

export const addToSheet = async (googleSheets, spreadsheetId, sheetName, rowData) => {
    await googleSheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A2`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [rowData],
        },
    });
};

export const updateMemberInSheet = async (googleSheets, spreadsheetId, sheetName, id, updatedData) => {
    // Fetch all data to find the row number of the member to update
    const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:Z`,
    });
    const rows = response.data.values;
    const rowIndex = rows.findIndex(row => row[0] == id);

    if (rowIndex === -1) {
        throw new Error(`Member with ID ${id} not found in the sheet.`);
    }

    // Update the row with the new data
    const range = `${sheetName}!A${rowIndex + 1}:Z${rowIndex + 1}`;
    await googleSheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [Object.values(updatedData)],
        },
    });
};

export const deleteMemberInSheet = async (googleSheets, spreadsheetId, sheetName, id) => {
    // Fetch all data to find the row number of the member to delete
    const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:Z`,
    });
    const rows = response.data.values;
    const rowIndex = rows.findIndex(row => row[0] == id);

    if (rowIndex === -1) {
        throw new Error(`Member with ID ${id} not found in the sheet.`);
    }

    // Clear the row data
    const range = `${sheetName}!A${rowIndex + 1}:Z${rowIndex + 1}`;
    await googleSheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
    });
};

export const getTotalDataLength = async (googleSheets, spreadsheetId, sheetName) => {
    const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:A`,
    });
    return response.data.values.length;
};

export const getAllData = async (googleSheets, spreadsheetId, sheetName) => {
    const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:Z`, // Adjust the range as needed
    });
    return response.data.values || [];
};