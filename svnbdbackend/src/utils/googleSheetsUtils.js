import { google } from 'googleapis';
import { renameFields } from './services.js';

const getSheetIdByName = async (googleSheets, spreadsheetId, sheetName) => {
    try {
        const response = await googleSheets.spreadsheets.get({ spreadsheetId });
        const sheet = response.data.sheets.find(s => s.properties.title === sheetName);
        if (!sheet) {
            throw new Error(`Sheet with name "${sheetName}" not found.`);
        }
        return sheet.properties.sheetId;  // This is the numeric sheet ID
    } catch (err) {
        console.error(`Error fetching Sheet ID: ${err.message}`);
        throw new Error("Failed to retrieve Sheet ID.");
    }
};

/**
 * Initializes the Google Sheets client and ensures the token is refreshed when needed.
 * @returns {Object} - The initialized Google Sheets client.
 * @throws Will throw an error if the client initialization fails.
 */
export const initGoogleSheetsClient = async () => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: 'credentials.json',  // Ensure the file path is correct
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        const client = await auth.getClient();
        if (!client) {
            throw new Error("Failed to obtain an authenticated client.");
        }
        return google.sheets({ version: "v4", auth: client });
    } catch (error) {
        console.error("Error initializing Google Sheets client:", error);
        throw new Error("Failed to initialize Google Sheets client.");
    }
};
/**
 * Initializes the Google Sheets client and validates its readiness.
 * @returns {Object} - The Google Sheets client.
 * @throws Will throw an error if the client fails to initialize.
 */
export const initializeGoogleSheets = async () => {
    try {
        const googleSheets = await initGoogleSheetsClient();
        if (!googleSheets) {
            throw new Error("Google Sheets client initialization failed.");
        }
        return googleSheets;
    } catch (error) {
        console.error("Error initializing Google Sheets:", error);
        throw error;
    }
};
export const addToSheet = async (googleSheets, spreadsheetId, sheetName, newRow) => {
    if (!Array.isArray(newRow) || newRow.length === 0) {
        throw new Error("Invalid data: newRow should be a non-empty array.");
    }
    try {
        // Dynamically calculate the next available row
        const response = await googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A`,
        });
        const lastRow = response.data.values ? response.data.values.length + 1 : 2;
        const range = `${sheetName}!A${lastRow}`;
        await googleSheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: {
                values: [newRow],
            },
        });
        console.log("New row added to Google Sheets.");
    } catch (error) {
        console.error("Error adding row to Google Sheets:", error);
        throw new Error(error);
    }
};
/**
 * Updates a member's data in Google Sheets by finding the row with the given serial_id.
 * @param {Object} googleSheets - The Google Sheets API instance.
 * @param {string} spreadsheetId - The ID of the Google Sheet.
 * @param {string} serial_id - The serial ID of the member to update.
 * @param {Object} updatedData - The updated member data.
 * @returns {Promise<void>}
 */
export const updateMemberInSheet = async (googleSheets, spreadsheetId, sheetName, serial_id, updatedData) => {
    try {
        const range = `${sheetName}!A:Z`;
        const response = await googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        if (!response.data.values || response.data.values.length === 0) {
            throw new Error("No data found in the Google Sheet.");
        }
        const rows = response.data.values;
        const headerRow = renameFields(rows[0]);
        // console.log("headerRow:", headerRow);
        const serialIdIndex = headerRow.indexOf("serial_id");
        if (serialIdIndex === -1) {
            throw new Error("Column 'serial_id' not found in Google Sheet.");
        }
        // console.log("Sheet Serial IDs:", rows.slice(1).map(row => row[serialIdIndex]));
        let rowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][serialIdIndex] !== undefined && String(rows[i][serialIdIndex]).trim() === String(serial_id).trim()) {
                rowIndex = i + 1; // Google Sheets API uses 1-based index
                break;
            }
        }
        // console.log("rowIndex:", rowIndex);
        if (rowIndex === -1) {
            throw new Error(`No matching row found for serial_id: ${serial_id}`);
        }
        // Get existing row data (excluding headers)
        const existingRow = rows[rowIndex - 1];
        // Add current date as "updated_at" in the last column
        const currentDate = new Date().toISOString().split("T")[0];
        const updatedRow = headerRow.map((column, index) =>
            updatedData[column] !== undefined ? updatedData[column] : existingRow[index]
        );
        // Update last column with current timestamp
        updatedRow[headerRow.length - 1] = currentDate;
        // console.log("Updated Row:", updatedRow);
        // Update Google Sheet with merged data
        await googleSheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
            valueInputOption: "RAW",
            resource: {
                values: [updatedRow],
            },
        });
        console.log(`Member with Serial ID '${serial_id}' updated successfully in Google Sheets with timestamp.`);
    } catch (error) {
        console.error("Error updating Google Sheets:", error.message);
        throw new Error("Failed to update Google Sheets: " + error.message);
    }
};
export const deleteMemberInSheet = async (googleSheets, spreadsheetId, sheetName, serial_id) => {
    try {
        const range = `${sheetName}!A:Z`;
        const response = await googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        if (!response.data.values || response.data.values.length === 0) {
            throw new Error("No data found in the Google Sheet.");
        }
        const rows = response.data.values;
        const headerRow = renameFields(rows[0]);
        const serialIdIndex = headerRow.indexOf("serial_id");
        if (serialIdIndex === -1) {
            throw new Error("Column 'serial_id' not found in Google Sheet.");
        }
        let rowIndex = -1;
        for (let i = 1; i < rows.length; i++) { // Start from 1 to skip headers
            if (rows[i][serialIdIndex] !== undefined && String(rows[i][serialIdIndex]).trim() === String(serial_id).trim()) {
                rowIndex = i; 
                break;
            }
        }
        if (rowIndex === -1) {
            throw new Error(`No matching row found for serial_id: ${serial_id}`);
        }
        // ✅ Fetch the correct numeric sheetId
        const sheetId = await getSheetIdByName(googleSheets, spreadsheetId, sheetName);
        // Delete row using batchUpdate API
        await googleSheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: sheetId, // ✅ Use numeric sheetId here
                                dimension: "ROWS",
                                startIndex: rowIndex, 
                                endIndex: rowIndex + 1
                            }
                        }
                    }
                ]
            }
        });

        console.log(`Member with Serial ID '${serial_id}' deleted successfully.`);
    } catch (err) {
        console.error("Error deleting member from Google Sheets:", err.message);
        throw new Error("Failed to delete member from Google Sheets: " + err.message);
    }
};
export const getTotalDataLength = async (googleSheets, spreadsheetId, sheetName) => {
    try {
        const response = await googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A`,
        });
        return response.data.values ? response.data.values.length : 0;
    } catch (error) {
        console.error("Error fetching total data length:", error);
        throw new Error("Failed to retrieve total data length.");
    }
};
