import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    initializeGoogleSheets,
    addToSheet,
    updateMemberInSheet,
    deleteMemberInSheet,
    getTotalDataLength,
} from "../../utils/googleSheetsUtils.js";
import {
    depositMapper,
    exportMapper,
    sanitizeData,
} from "../../utils/services.js";
import Deposit from "../../models/data/deposit.model.js";
import dotenv from "dotenv";

dotenv.config();

const SPREADSHEET_ID = process.env.DEPOSIT_SHEET_ID || "1orzWP59gYcb7yt5mDmHbrUIEQy4GU0ifa5D-doJorfs";
if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is missing. Please configure it in the environment variables.");
}

// Get total members count
export const getDepositsLength = asyncHandler(async (_, res) => {
    const totalCount = await Deposit.countDocuments({});
    return res.status(200).json({
        message: "Total deposits retrieved successfully.",
        data: totalCount,
    });
});
export const getDepositByName = asyncHandler(async (req, res) => {
    const { name } = req.params;
    if (!name) {
        return res.status(400).json({
            message: "'Name' parameter is required.",
        });
    }
    const deposit = await Deposit.find({ name: { $regex: name, $options: "i" } }).select("-updatedAt -__v").lean();
    if (!deposit) {
        return res.status(404).json({
            message: "Deposit not found.",
        });
    }

    return res.status(200).json({
        message: "Deposit retrieved successfully.",
        data: deposit,
    });
});
export const getDepositById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "'id' parameter is required." });
    }
    const deposit = await Deposit.findOne({ serial_id: id }).select("-updatedAt -__v").lean();
    if (!deposit) {
        return res.status(404).json({ message: "Deposit not found." });
    }

    return res.status(200).json({
        message: "Deposit retrieved successfully.",
        data: deposit,
    });
});
export const getDepositByFc = asyncHandler(async (req, res) => {
    const { fc } = req.params;
    if (!fc) {
        return res.status(400).json({ message: "'fc' parameter is required." });
    }
    const deposit = await Deposit.find({ fc_no: fc }).select("-updatedAt -__v").lean();
    if (!deposit) {
        return res.status(404).json({ message: "Deposit not found." });
    }

    return res.status(200).json({
        message: "Deposit retrieved successfully.",
        data: deposit,
    });
});
export const addDeposit = asyncHandler(async (req, res) => {
    const googleSheets = await initializeGoogleSheets();
    const lastDeposit = await Deposit.findOne().sort({ serial_id: -1 }).select("serial_id");
    req.body.serial_id = lastDeposit ? lastDeposit.serial_id + 1 : 1;
    const deposit = await Deposit.create(req.body);
    if (!deposit) {
        return res.status(400).json({
            message: "Deposit not created",
            data: {}
        });
    }
    try {
        const sanitizedData = sanitizeData(depositMapper([deposit]));
        await addToSheet(googleSheets, SPREADSHEET_ID, "Deposit", sanitizedData[0]);
    } catch (gsError) {
        return res.status(500).json({
            message: "Deposit added to MongoDB, but failed to add to Google Sheets.",
            error: gsError.message,
        });
    }

    res.status(201).json({
        message: "Deposit added successfully to MongoDB and Google Sheets.",
        data: deposit,
    });
});
export const updateDeposit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    if (!id) {
        return res.status(400).json({ message: "The 'id' parameter is required" });
    }
    const googleSheets = await initializeGoogleSheets();
    const deposit = await Deposit.findOneAndUpdate({ serial_id: id }, updatedData, { new: true });
    if (!deposit) {
        return res.status(404).json({ message: "Deposit not found." });
    }
    try {
        await updateMemberInSheet(googleSheets, SPREADSHEET_ID, "Deposit", id, updatedData);
        return res.status(200).json({ message: `Deposit updated successfully.` });
    } catch (e) {
        console.error("Error updating member from Google Sheets:", e.message);
        return res.status(500).json({
            message: "Member updated from MongoDB, but failed to update from Google Sheets.",
            error: e.message,
        });
    }
});
export const deleteDeposit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "The 'id' parameter is required" });
    }
    const googleSheets = await initializeGoogleSheets();
    const deposit = await Deposit.findOneAndDelete({ serial_id: id });
    if (!deposit) {
        return res.status(404).json({ message: "Deposit not found" });
    }
    try {
        await deleteMemberInSheet(googleSheets, SPREADSHEET_ID, "Deposit", id);
        return res.status(200).json({ message: "Member deleted successfully." });
    } catch (e) {
        console.error("Error deleting member from Google Sheets:", e.message);
        return res.status(500).json({
            message: "Member deleted from MongoDB, but failed to delete from Google Sheets.",
            error: e.message,
        });
    }
});