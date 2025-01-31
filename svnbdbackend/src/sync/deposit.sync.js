import dotenv from "dotenv";
import connectDB from '../db/connectDB.js';
import Deposit from '../models/data/deposit.model.js';
import { initializeGoogleSheets } from '../utils/googleSheetsUtils.js';
import { getAllData } from '../utils/services.js';
import { asyncHandler } from '../utils/asyncHandler.js';

dotenv.config();

// Ensure environment variables are loaded
const SPREADSHEET_ID = "1orzWP59gYcb7yt5mDmHbrUIEQy4GU0ifa5D-doJorfs";
if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is missing. Please configure it in the environment variables.");
}

// Function to sync data from Google Sheets to MongoDB
const syncData = asyncHandler(async () => {
    try {
        const googleSheets = await initializeGoogleSheets();
        const rows = await getAllData(googleSheets, SPREADSHEET_ID, "Deposit");
        if (rows.length > 0) {
            const data = rows.map((row) => ({
                serial_id: row[0],
                name: row[1]?.toLowerCase(),
                address: row[2]?.toLowerCase(),
                phone: row[3],
                fc_no: row[4],
                pan: row[5]?.toLowerCase(),
                amount: row[6],
                createdAt: row[7], // Ensure correct date format
                last_deposit: row[8], // Ensure correct date format
            }));
            // Prepare bulk operations
            const bulkOps = data.map((item) => ({
                updateOne: {
                    filter: { serial_id: item.serial_id }, // Match on unique field
                    update: { $set: item }, // Only update the provided fields
                    upsert: true, // Insert if not found
                },
            }));
            // Execute bulk write
            await Deposit.bulkWrite(bulkOps);
            console.log(`${bulkOps.length} records synced to MongoDB Atlas successfully.`);
        } else {
            console.log("No data found in the Google Sheet.");
        }
    } catch (error) {
        console.error("Error syncing data:", error.message);
        throw error; // Re-throw error for higher-level handling
    }
});

connectDB().then(() => {
    console.log("Connected to MongoDB Atlas to sync member data");
    syncData();
}).catch(err => {
    console.error("Failed to connect to sync data: ", err);
    process.exit(1);
})