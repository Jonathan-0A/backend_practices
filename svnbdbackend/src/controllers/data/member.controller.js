import { asyncHandler } from "../../utils/asyncHandler.js";
import Member from "../../models/data/member.model.js";
import { addToSheet, initializeGoogleSheets, updateMemberInSheet, deleteMemberInSheet } from "../../utils/googleSheetsUtils.js";
import {
    memberMapper,
    sanitizeData,
} from "../../utils/services.js";

const SPREADSHEET_ID = process.env.MEMBER_SHEET_ID || "1_WI_q_W2CGf9Ep2AK6MpBfURURS3o_c5NxWljZBuKhQ";
if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is missing. Please configure it in the environment variables.");
}

// Get total members count
export const getMembersLength = asyncHandler(async (_, res) => {
    try {
        const totalCount = await Member.countDocuments({});
        // const maxSerialId = await Member.findOne().sort({ serial_id: -1 }).select("serial_id").lean();

        return res.status(200).json({
            message: "Total members retrieved successfully.",
            data: totalCount,
        });
    } catch (error) {
        console.error("Error fetching members count:", error.message);
        return res.status(500).json({
            message: "Failed to retrieve members count.",
            error: error.message,
        })
    }
});
export const getMemberByName = asyncHandler(async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({ message: "The 'name' parameter is required." });
    }

    try {
        const members = await Member.find({ name: { $regex: name, $options: "i" } })
            .select("-__v")
            .lean();

        if (!members.length) {
            return res.status(404).json({ message: "No members found with the given name." });
        }

        return res.status(200).json({
            message: "Members retrieved successfully.",
            data: members, // Returns an array of members
        });
    } catch (err) {
        console.error("Error fetching members by name:", err.message);
        res.status(500).json({
            message: "Failed to retrieve members by name.",
            error: err.message,
        });
    }
});
export const getMemberById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "The 'id' parameter is required." });
    }
    try {
        const member = await Member.findOne({ serial_id: id }).select("-__v").lean();
        if (!member) {
            return res.status(404).json({ message: "Member not found." });
        }
        return res.status(200).json({
            message: "Member retrieved successfully.",
            data: member,
        });
    } catch (err) {
        console.error("Error fetching member by ID:", err.message);
        res.status(500).json({
            message: "Failed to retrieve member by ID.",
            error: err.message,
        });
    }
});
export const getMemberByFc = asyncHandler(async (req, res) => {
    const { fc_no } = req.params;
    if (!fc_no) {
        return res.status(400).json({ message: "The 'fc_no' parameter is required." });
    }
    try {
        const members = await Member.find({ fc_no }).select("-__v").lean(); // Finds all members with the given fc_no
        if (!members.length) {
            return res.status(404).json({ message: "No members found with the provided FC number." });
        }

        return res.status(200).json({
            message: "Members retrieved successfully.",
            data: members, // Returns an array of members
        });
    } catch (err) {
        console.error("Error fetching members by FC:", err.message);
        res.status(500).json({
            message: "Failed to retrieve members by FC.",
            error: err.message,
        });
    }
});
export const addMember = asyncHandler(async (req, res) => {
    const googleSheets = await initializeGoogleSheets();
    try {
        const serial_id = await Member.countDocuments({}) + 1;
        req.body.serial_id = serial_id;
        const member = new Member(req.body);
        await member.save();
        try {
            const newRowData = memberMapper([member]);
            const sanitizedData = sanitizeData(newRowData);
            console.log(sanitizedData);
            await addToSheet(googleSheets, SPREADSHEET_ID, "infoDatabase", sanitizedData[0]);
            console.log("Member added to Google Sheets.");

        } catch (googleSheetsError) {
            console.error("Error adding member to Google Sheets:", googleSheetsError.message);
            return res.status(500).json({
                message: "Member added to MongoDB, but failed to add to Google Sheets.",
                error: googleSheetsError.message,
            });
        }
        return res.status(201).json({
            message: "Member added successfully to MongoDB and Google Sheets.",
            data: member,
        });

    } catch (err) {
        console.error("Error adding member:", err.message);
        return res.status(500).json({
            message: "Failed to add member.",
            error: err.message,
        });
    }
});
// Update existing member
export const updateMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    if (!id) {
        return res.status(400).json({ message: "The 'id' parameter is required." });
    }
    try {
        const member = await Member.findOneAndUpdate({ serial_id: id }, updatedData, { new: true });
        if (!member) {
            return res.status(404).json({ message: "Member not found." });
        }
        const googleSheets = await initializeGoogleSheets();
        await updateMemberInSheet(googleSheets, SPREADSHEET_ID, "infoDatabase", id, updatedData);

        return res.status(200).json({ message: `Member updated successfully.` });
    } catch (error) {
        console.error("Error updating member:", error.message);
        return res.status(500).json({
            message: "Failed to update member.",
            error: error.message,
        });
    }
});
// // Delete member
export const deleteMember = asyncHandler(async (req, res) => {
    const {id} = req.params;
    if(!id) {
        return res.status(400).json({ message: "The 'id' parameter is required." });
    }
    try {
        const member = await Member.findOneAndDelete({ serial_id: id });
        if(!member) {
            return res.status(404).json({ message: "Member not found." });
        }
        const googleSheets = await initializeGoogleSheets();
        try {
            await deleteMemberInSheet(googleSheets, SPREADSHEET_ID, "infoDatabase", id);
            
            return res.status(200).json({ message: "Member deleted successfully." });
        } catch(e) {
            console.error("Error deleting member from Google Sheets:", e.message);
            return res.status(500).json({
                message: "Member deleted from MongoDB, but failed to delete from Google Sheets.",
                error: e.message,
            });
        }
    } catch(err) {
        console.error("Error deleting member:", err.message);
        return res.status(500).json({
            message: "Failed to delete member.",
            error: err.message,
        });
    }
});