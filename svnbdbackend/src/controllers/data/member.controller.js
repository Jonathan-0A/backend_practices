import dotenv from "dotenv";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { parseGoogleSheetsData, initializeGoogleSheets, syncMongoToSheets } from "../../utils/googleSheetsUtils.js";
import { renameFields, getHeaders, getPaginatedRows } from "../../utils/services.js";

dotenv.config();

const SPREADSHEET_ID = process.env.MEMBER_SHEET_ID || "1_WI_q_W2CGf9Ep2AK6MpBfURURS3o_c5NxWljZBuKhQ";
const DEFAULT_PAGE_SIZE = parseInt(process.env.PAGE_SIZE || "50", 10); // Default page size for pagination
if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is missing. Please configure it in the environment variables.");
}

// Fetch total members count
export const getMembersLength = asyncHandler(async (_, res) => {
    try {
        const googleSheets = await initializeGoogleSheets();
        const rows = await getPaginatedRows(googleSheets, SPREADSHEET_ID, 2, DEFAULT_PAGE_SIZE); // Start from the second row
        return res.status(200).json({
            message: "Total members retrieved successfully.",
            data: rows.length,
        });
    } catch (error) {
        console.error("Error fetching members count:", error.message);
        return res.status(500).json({
            message: "Failed to retrieve the total number of members.",
            error: error.message,
        });
    }
});
// Fetch member by name
export const getMemberByName = asyncHandler(async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ message: "The 'name' parameter is required." });
        }
        const googleSheets = await initializeGoogleSheets();
        const headers = await getHeaders(googleSheets, SPREADSHEET_ID);
        let startRow = 2; // Start after the header row
        let member = null;
        // Loop through paginated rows until a match is found
        while (!member) {
            const rows = await getPaginatedRows(googleSheets, SPREADSHEET_ID, startRow, DEFAULT_PAGE_SIZE);
            if (rows.length === 0) break; // Exit if no rows are left
            member = parseGoogleSheetsData(headers, rows).find((rowObject) =>
                rowObject.name?.toLowerCase().includes(name.toLowerCase())
            );
            startRow += DEFAULT_PAGE_SIZE; // Move to the next chunk
        }
        if (!member) {
            return res.status(404).json({ message: `No member found with the name '${name}'.` });
        }

        return res.status(200).json({
            message: "Member retrieved successfully.",
            data: renameFields(member),
        });
    } catch (error) {
        console.error("Error fetching member by name:", error.message);
        return res.status(500).json({
            message: "Failed to retrieve member by name.",
            error: error.message,
        });
    }
});
// Fetch member by ID
export const getMemberById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "The 'id' parameter is required." });
        }
        const googleSheets = await initializeGoogleSheets();
        const headers = await getHeaders(googleSheets, SPREADSHEET_ID);
        let startRow = 2; // Start after the header row
        let member = null;
        // Loop through paginated rows until a match is found
        while (!member) {
            const rows = await getPaginatedRows(googleSheets, SPREADSHEET_ID, startRow, DEFAULT_PAGE_SIZE);
            if (rows.length === 0) break; // Exit if no rows are left
            member = parseGoogleSheetsData(headers, rows).find((rowObject) => rowObject.serial_id === id);
            startRow += DEFAULT_PAGE_SIZE; // Move to the next chunk
        }
        if (!member) {
            return res.status(404).json({ message: `No member found with the ID '${id}'.` });
        }

        return res.status(200).json({
            message: "Member retrieved successfully.",
            data: renameFields(member),
        });
    } catch (error) {
        console.error("Error fetching member by ID:", error.message);
        return res.status(500).json({
            message: "Failed to retrieve member by ID.",
            error: error.message,
        });
    }
});
export const addMember = asyncHandler(async (req, res) => {
    try {
        const newMember = new Member(req.body);
        await newMember.save();
        console.log("New member added to MongoDB.");
        // Trigger sync
        await syncMongoToSheets(SPREADSHEET_ID);

        res.status(201).json({ message: "Member added and synced successfully." });
    } catch (error) {
        console.error("Error adding member:", error.message);
        return res.status(500).json({
            message: "Failed to add member.",
            error: error.message,
        });
    }
});