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

const SPREADSHEET_ID = process.env.DEPOSIT_SHEET_ID || "1orzWP59gYcb7yt5mDmHbrUIEQy4GU0ifa5D-doJorfs";
if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is missing. Please configure it in the environment variables.");
}
const EXPORT_SPREADSHEET_ID = process.env.EXPORT_DEPOSIT_SHEET_ID || "1K6UmJxV1XAi523wb1BPTC5AAzmwJUBP74zf7LGBMgO8";
if (!SPREADSHEET_ID) {
    throw new Error("Export Spreadsheet ID is missing. Please configure it in the environment variables.");
}

// Get total members count
export const getDepositsLength = asyncHandler(async (_, res) => {
    try {
        const totalCount = await Deposit.countDocuments({});
        return res.status(200).json({
            message: "Total deposits retrieved successfully.",
            data: totalCount,
        });
    } catch (error) {
        console.error("Error fetching deposits count:", error.message);
        return res.status(500).json({
            message: "Failed to retrieve deposits count.",
            error: error.message,
        })
    }
});
export const getDepositByName = asyncHandler(async (req, res) => {
    const { name } = req.params;
    if (!name) {
        return res.status(400).json({
            message: "'Name' parameter is required.",
        });
    }
    try {
        const deposit = await Deposit.find({ name: { $regex: name, $options: "i" } }).select("-updatedAt -__v").lean();
        if (!deposit) {
            return res.status(404).json({
                message: "Deposit not found.",
            });
        }

        return res.status(200).json({
            message: "Deposit retrieved successfully.",
            data: deposit,
        })
    } catch (err) {
        console.log("Error fetching deposit by name:", err.message);
        return res.status(500).json({
            message: "Failed to retrieve deposit by name.",
            error: err.message,
        })
    }
})
export const getDepositById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "'id' parameter is required." });
    }
    try {
        const deposit = await Deposit.findOne({ serial_id: id }).select("-updatedAt -__v").lean();
        if (!deposit) {
            return res.status(404).json({ message: "Deposit not found." });
        }

        return res.status(200).json({
            message: "Deposit retrieved successfully.",
            data: deposit,
        })
    } catch (err) {
        console.log("Error fetching deposit by id:", err.message);
        return res.status(500).json({
            message: "Failed to retrieve deposit by id.",
            error: err.message,
        });
    }
});
export const getDepositByFc = asyncHandler(async (req, res) => {
    const { fc } = req.params;
    if (!fc) {
        return res.status(400).json({ message: "'fc' parameter is required." });
    }
    try {
        const deposit = await Deposit.find({ fc_no: fc }).select("-updatedAt -__v").lean();
        if (!deposit) {
            return res.status(404).json({ message: "Deposit not found." });
        }

        return res.status(200).json({
            message: "Deposit retrieved successfully.",
            data: deposit,
        });
    } catch (err) {
        console.log("Error fetching deposit by fc:", err.message);
        return res.status(500).json({
            message: "Failed to retrieve deposit by fc.",
            error: err.message,
        });
    }
});
export const addDeposit = asyncHandler(async (req, res) => {
    const googleSheets = await initializeGoogleSheets();
    try {
        const serial_id = await Deposit.countDocuments({}) + 1;
        req.body.serial_id = serial_id
        const deposit = new Deposit(req.body)
        await deposit.save();
        try {
            const newRowData = depositMapper([deposit])
            const sanitizedData = sanitizeData(newRowData);
            console.log(sanitizedData);
            await addToSheet(googleSheets, SPREADSHEET_ID, "Deposit", sanitizedData[0]);
            console.log("Deposit added to Google Sheets.");
        } catch (gsError) {
            console.error("Error adding deposit to Google Sheets:", gsError.message);
            return res.status(500).json({
                message: "Deposit added to MongoDB, but failed to add to Google Sheets.",
                error: gsError.message,
            });
        }

        return res.status(201).json({
            message: "Deposit added successfully to MongoDB and Google Sheets.",
            data: deposit,
        });
    } catch (err) {
        console.error("Error adding deposit: ", err.message);
        res.status(500).json({
            message: "Failed to add deposit",
            error: err.message
        })
    }
});
export const updateDeposit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    if (!id) {
        return res.status(400).json({ message: "The 'íd' parameter is required" })
    }
    const googleSheets = await initializeGoogleSheets();
    try {
        const deposit = await Deposit.findOneAndUpdate({ serial_id: id }, updatedData, { new: true })
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
    } catch (err) {
        console.log(("Error updating deposit: ", err.message))
        return res.status(500).json({
            message: "Failed to update deposit",
            data: err.message
        })
    }
})
export const deleteDeposit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "The 'id' parameter is required" })
    }
    const googleSheets = await initializeGoogleSheets();
    try {
        const deposit = await Deposit.findOneAndDelete({ serial_id: id })
        if (!deposit) {
            return res.status(404).json({ message: "Deposit not found" })
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
    } catch (err) {
        console.error("Error deleting deposit: ", err.message)
        return res.status(500).json({
            message: "Failed to delete deposit",
            data: err.message
        })
    }
})
export const exportDeposit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "The 'id' parameter is required" })
    }
    const googleSheets = await initializeGoogleSheets();
    try {
        const len = await getTotalDataLength(googleSheets, EXPORT_SPREADSHEET_ID, "exportedDeposit");
        req.body.serial_id = Number(len);
        const deposit = req.body;
        const newRowData = exportMapper([deposit])
        const sanitizedData = sanitizeData(newRowData);
        console.log(sanitizedData);
        await Deposit.findOneAndUpdate({ serial_id: id },
            { amount: req.body.amount },
            { new: false }).then(async (e) => {
                await addToSheet(googleSheets, EXPORT_SPREADSHEET_ID, "exportedDeposit", sanitizedData[0]).then(() => {
                    console.log("Deposit added to Google Sheets.");
                    updateMemberInSheet(googleSheets, SPREADSHEET_ID, "Deposit",
                        id, { updatedAt: new Date().toISOString().split('T')[0] }
                    );
                });
            });

        return res.status(201).json({
            message: "Deposit exported successfully to Google Sheets.",
            data: deposit,
        })
    } catch (gsError) {
        console.error("Error exporting deposit to Google Sheets:", gsError.message);
        return res.status(500).json({
            message: "Deposit exported to MongoDB, but failed to export to Google Sheets.",
            error: gsError.message,
        });
    }
});