import { asyncHandler } from "../../utils/asyncHandler.js";
import pg from "pg";
import dotenv from "dotenv";
import ExportedDeposit from "../../models/data/exported_deposit.model.js";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: `${process.env.NEONDB_URL}?sslmode=require`,
    ssl: {
        rejectUnauthorized: false,
    },
});
const createSchemaIfNotExists = async (schemaName) => {
    const query = `CREATE SCHEMA IF NOT EXISTS ${schemaName}`;
    await pool.query(query);
};
const createTableIfNotExists = async (schemaName, tableName) => {
    const query = `
        CREATE TABLE IF NOT EXISTS ${schemaName}.${tableName} (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            address VARCHAR(255),
            phone BIGINT,
            fc_no VARCHAR(255),
            pan VARCHAR(255),
            amount INT
        );
    `;
    await pool.query(query);
};
export const exportDeposit = asyncHandler(async (req, res) => {
    try {
        const { data, table } = req.body;
        const parsedData = JSON.parse(data); // Parse the raw JSON data
        parsedData.table = table; // Add the table field to the parsed data
        // Insert data into MongoDB
        const mongoResult = await ExportedDeposit.create(parsedData);
        // Send success response to frontend
        res.status(201).json({
            message: "Deposit exported successfully",
        });

        // Start background processing
        processDepositsInBackground();
    } catch (err) {
        console.error("Error exporting deposit:", err.message);
        return res.status(500).json({
            message: "Deposit failed to export.",
            error: err.message,
        });
    }
});
const processDepositsInBackground = async () => {
    while (true) {
        const deposit = await ExportedDeposit.findOne();
        if (!deposit) break;
        try {
            const { table } = deposit;
            const schemaName = 'monthlyDeposits';
            await createSchemaIfNotExists(schemaName);
            await createTableIfNotExists(schemaName, table);
            const query = `
                INSERT INTO ${schemaName}.${table} (name, address, phone, fc_no, pan, amount)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await pool.query(query, [
                deposit.name,
                deposit.address,
                deposit.phone,
                deposit.fc_no,
                deposit.pan,
                deposit.amount,
            ]);
            // Delete the data from MongoDB after successful insertion into NeonDB
            await ExportedDeposit.deleteOne({ _id: deposit._id });
        } catch (gsError) {
            console.error("Error exporting deposit to NeonDB:", gsError.message);
            break;
        }
    }
};
export const getExportedDeposits = asyncHandler(async (req, res) => {
    try {
        const { table } = req.params;
        const schemaName = 'monthlyDeposits';
        await createSchemaIfNotExists(schemaName);
        await createTableIfNotExists(schemaName, table);
        const query = `SELECT * FROM ${schemaName}.${table}`;
        const result = await pool.query(query);

        return res.status(200).json({
            message: "Exported deposits retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error fetching exported deposits:", error.message);
        return res.status(500).json({
            message: "Failed to fetch exported deposits.",
            error: error.message,
        });
    }
});
export const getExportedDepositsCount = asyncHandler(async (req, res) => {
    try {
        const { table } = req.params;
        const schemaName = 'monthlyDeposits';
        await createSchemaIfNotExists(schemaName);
        await createTableIfNotExists(schemaName, table);
        const query = `SELECT COUNT(*) FROM ${schemaName}.${table}`;
        const result = await pool.query(query);

        return res.status(200).json({
            message: "Exported deposits count retrieved successfully.",
            data: result.rows[0].count,
        });
    } catch (error) {
        console.error("Error fetching exported deposits count:", error.message);
        return res.status(500).json({
            message: "Failed to fetch exported deposits count.",
            error: error.message,
        });
    }
});