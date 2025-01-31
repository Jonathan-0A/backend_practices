import { google } from "googleapis";

/**
 * Initializes the Google Sheets client.
 * @returns {Object} - The initialized Google Sheets client.
 * @throws Will throw an error if the client initialization fails.
 */
export const initGoogleSheetsClient = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json", // Ensure this file is secure and available
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const client = await auth.getClient();
    return google.sheets({ version: "v4", auth: client });
};
/**
 * Initializes the Google Sheets client and validates its readiness.
 * @returns {Object} - The Google Sheets client.
 * @throws Will throw an error if the client fails to initialize.
 */
export const initializeGoogleSheets = async () => {
    const googleSheets = await initGoogleSheetsClient();
    if (!googleSheets) {
        throw new Error("Failed to initialize Google Sheets client.");
    }
    return googleSheets;
};
export const addToSheet = async (googleSheets, spreadsheetId, sheetName, newRow) => {
    await googleSheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A2`, // Adjust columns based on data structure
        valueInputOption: "RAW",
        requestBody: {
            values: [newRow]
        }
    });
}