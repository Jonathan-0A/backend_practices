import Member from '../src/models/data/member.model.js';
import { initializeGoogleSheets } from '../src/utils/googleSheetsUtils.js';
import { getAllData } from '../src/utils/services.js';
import { asyncHandler } from '../src/utils/asyncHandler.js';
import connectDB from '../src/db/connectDB.js';
import dotenv from "dotenv";

dotenv.config();

const SPREADSHEET_ID = "1_WI_q_W2CGf9Ep2AK6MpBfURURS3o_c5NxWljZBuKhQ";
if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is missing. Please configure it in the environment variables.");
}

const syncData = asyncHandler(async (req, res) => {
    try {
        const googleSheets = await initializeGoogleSheets();
        const rows = await getAllData(googleSheets, SPREADSHEET_ID, "infoDatabase");
        if (rows.length > 0) {
            const data = rows.map((row) => ({
                serial_id: row[0],
                dp_serial: row[1],
                fc_no: row[2],
                name: row[3]?.toLowerCase(),
                rittwik: row[4]?.toLowerCase(),
                address: row[5]?.toLowerCase(),
                phone: row[6],
                adhaar: row[7],
                pan: row[8]?.toLowerCase(),
                dp_status: row[9],
                dikshyarti: row[10],
                swastayani: row[11],
                initiation_date: row[12],
            }));
            // Prepare bulk operations
            const bulkOps = data.map((item) => ({
                updateOne: {
                    filter: { serial_id: item.serial_id }, // Unique field
                    update: item,
                    upsert: true,
                },
            }));
            // Execute bulk write
            await Member.bulkWrite(bulkOps);
            console.log("Data synced to MongoDB Atlas successfully.");
        } else {
            if(!rows || rows.length === 0) {
                console.log("No data found in the Google Sheet.");
            }
        }
    } catch (error) {
        console.error("Error syncing data:", error.message);
    }
})

connectDB().then(() => {
    console.log("Connected to MongoDB Atlas to sync member data");
    syncData();
}).catch(err => {
    console.error("Failed to connect to sync data: ", err);
    process.exit(1);
})