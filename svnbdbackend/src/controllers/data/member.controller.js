import { asyncHandler } from "../../utils/asyncHandler.js";
// import {
//     initializeGoogleSheets,
//     syncMongoToSheets,
// } from "../../utils/googleSheetsUtils.js";
// import {
//     renameFields,
//     getAllDataRows,
//     findData,
//     updateMemberInSheet,
//     deleteRowInSheet,
// } from "../../utils/services.js";
import Member from "../../models/data/member.model.js";
import { addToSheet, initializeGoogleSheets } from "../../utils/googleSheetsUtils.js";

const SPREADSHEET_ID = process.env.MEMBER_SHEET_ID || "1_WI_q_W2CGf9Ep2AK6MpBfURURS3o_c5NxWljZBuKhQ";
if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is missing. Please configure it in the environment variables.");
}
const memberMapper = (dataArray) => {
    return dataArray.map((data) => [
        data._id.toString().slice(-7), // MongoDB ID (last 7 characters)
        data.dp_serial || 0,
        `'${data.fc_no}`, // Ensures `fc_no` is stored as text
        data.name?.toUpperCase() || "",
        data.rittwik?.toUpperCase() || null,
        data.address?.toUpperCase() || "",
        data.phone || 0,
        data.adhaar || 0,
        data.pan?.toUpperCase() || 0,
        data.dp_status || "FW Pending",
        data.dikshyarti || "Yes",
        data.swastayani || "No",
        data.initiation_date
            ? data.initiation_date.toISOString().split("T")[0].split("-").reverse().join("/")
            : "",
        data.createdAt
            ? data.createdAt.toISOString().split("T")[0].split("-").reverse().join("/")
            : "",
    ]);
};

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
// Add new member.
export const addMember = asyncHandler(async (req, res) => {
    const googleSheets = await initializeGoogleSheets();
    try {
        const serial_id = await Member.countDocuments({}) + 1;
        req.body.serial_id = serial_id;
        const member = new Member(req.body);
        await member.save();
        await addToSheet(googleSheets, SPREADSHEET_ID, "infoDatabase", memberMapper([member])).then(() => {
            console.log("Member added to Google Sheets.");
        }).catch((error) => {
            console.error("Error adding member to Google Sheets:", error.message);
            return res.status(500).json({
                message: "Failed to add member to Google Sheets.",
                error: error.message,
            })
        });

        return res.status(201).json({
            message: "Member added successfully.",
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
// // Update existing member
// export const updateMember = asyncHandler(async (req, res) => {
//     const { id } = req.params; // Extract member ID from request parameters
//     const updatedData = req.body; // Extract updated data from request body
//     if (!id) {
//         return res.status(400).json({ message: "The 'id' parameter is required." });
//     }
//     const googleSheets = await initializeGoogleSheets();
//     try {
//         // const message = await updateMemberInSheet(googleSheets, SPREADSHEET_ID, id, updatedData);
//         const message = `Member with ID '${id}' updated successfully tested.`;
//         return res.status(200).json({ message });
//     } catch (error) {
//         console.error("Error updating member:", error.message);
//         return res.status(500).json({
//             message: "Failed to update member.",
//             error: error.message,
//         });
//     }
// });
// // Delete member
// export const deleteMember = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     if (!id) {
//         return res.status(400).json({ message: "The 'id' parameter is required." });
//     }
//     const googleSheets = await initializeGoogleSheets();
//     try {
//         // const message = await deleteRowInSheet(googleSheets, SPREADSHEET_ID, id, "infoDatabase!A2:Z");
//         const message = `Member with ID '${id}' deleted successfully tested.`;
//         console.log(message);
//         res.status(200).json({ message });
//     } catch (error) {
//         console.error("Error deleting member:", error.message);
//         res.status(500).json({
//             message: "Failed to delete member.",
//             error: error.message,
//         });
//     }
// });