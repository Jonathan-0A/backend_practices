import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from '../src/db/connectDB.js';
import exportedDeposit from '../src/models/data/exported_deposit.model.js';
import { asyncHandler } from '../src/utils/asyncHandler.js';

dotenv.config();

const syncData = asyncHandler(async () => {
    const filePath = path.resolve('exportedDeposits.json'); // Corrected path
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const deposits = JSON.parse(fileContent).filteredData;
    // console.log(deposits);

    if (deposits.length > 0) {
        const bulkOps = deposits.map((deposit) => ({
            updateOne: {
                filter: { serial_id: deposit.id },
                update: {
                    serial_id: deposit.id,
                    name: deposit.name?.toLowerCase(),
                    address: deposit.address?.toLowerCase(),
                    phone: deposit.phone || "0",
                    fc_no: deposit.fc || "0",
                    pan: deposit.pan?.toLowerCase(),
                    amount: deposit.amount || 0,
                    date: deposit.last_deposit || null,
                },
                upsert: true,
            },
        }));

        await exportedDeposit.bulkWrite(bulkOps);
        console.log(`${bulkOps.length} records synced to MongoDB Atlas successfully.`);
    } else {
        console.log("No data found in the JSON file.");
    }
});

connectDB().then(() => {
    console.log("Connected to MongoDB Atlas to sync deposit data");
    syncData();
}).catch(err => {
    console.error("Failed to connect to sync data: ", err);
    process.exit(1);
});