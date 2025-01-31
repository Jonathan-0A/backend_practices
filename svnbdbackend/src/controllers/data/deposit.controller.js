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
import Deposit from "../../models/data/deposit.model.js";

const SPREADSHEET_ID = process.env.DEPOSIT_SHEET_ID || "1orzWP59gYcb7yt5mDmHbrUIEQy4GU0ifa5D-doJorfs";
if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is missing. Please configure it in the environment variables.");
}
//     return dataArray.map((data) => [
//         data._id.toString().slice(-7), // MongoDB ID (last 7 characters)
//         data.dp_serial || 0,
//         `'${data.fc_no}`, // Ensures `fc_no` is stored as text
//         data.name?.toUpperCase() || "",
//         data.rittwik?.toUpperCase() || null,
//         data.address?.toUpperCase() || "",
//         data.phone || 0,
//         data.adhaar || 0,
//         data.pan?.toUpperCase() || 0,
//         data.dp_status || "FW Pending",
//         data.dikshyarti || "Yes",
//         data.swastayani || "No",
//         data.initiation_date
//             ? data.initiation_date.toISOString().split("T")[0].split("-").reverse().join("/")
//             : "",
//         data.createdAt
//             ? data.createdAt.toISOString().split("T")[0].split("-").reverse().join("/")
//             : "",
//     ]);
// };

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
        const deposit = await Deposit.find({ name: { $regex: name, $options: "i" } }).lean();
        if(!deposit) {
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