import { google } from "googleapis";
import Member from "../models/data/member.model.js";

export const initGoogleSheetsClient = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json", // Ensure this file is secure
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const client = await auth.getClient();
    return google.sheets({ version: "v4", auth: client });
};
export const initializeGoogleSheets = async () => {
    const googleSheets = await initGoogleSheetsClient();
    if (!googleSheets) {
        throw new Error("Failed to initialize Google Sheets client.");
    }
    return googleSheets;
};
export const parseGoogleSheetsData = (headers, rows) => {
    return rows.map((row) => {
        const rowObject = {};
        headers.forEach((header, index) => {
            const formattedHeader = header.trim().replace(/\s+/g, "_").toLowerCase();
            rowObject[formattedHeader] = row[index] ? row[index].trim() : null;
        });
        return rowObject;
    });
};
export const syncMongoToSheets = async (sheetId) => {
    try {
        const googleSheets = await initializeGoogleSheets();
        // Fetch unsynced data from MongoDB
        const unsyncedMembers = await Member.find();
        if (unsyncedMembers.length === 0) {
            console.log("No new data to sync.");
            return;
        }
        // Prepare data for Google Sheets
        const rows = unsyncedMembers.map((member) => [
            member._id.toString(), // Include MongoDB ID as a reference
            member.dp_serial || 0,
            member.fc_no,
            member.name,
            member.rittwik || null,
            member.address,
            member.phone || 0,
            member.adhaar || 0,
            member.pan || 0,
            member.dp_status,
            member.dikshyarti,
            member.swastayani,
            member.initiation_date || "",
        ]);
        // Append data to Google Sheets
        await googleSheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: "infoDatabase!A2", // Adjust range as needed
            valueInputOption: "USER_ENTERED",
            resource: { values: rows },
        });
        console.log("Data synced to Google Sheets.");
        // Delete synced data from MongoDB
        const idsToDelete = unsyncedMembers.map((member) => member._id);
        await Member.deleteMany({ _id: { $in: idsToDelete } });
        console.log("Synced data deleted from MongoDB.");
    } catch (err) {
        console.error("Error syncing data:", err.message);
    }
};
