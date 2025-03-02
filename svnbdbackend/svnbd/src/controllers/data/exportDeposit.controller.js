import { asyncHandler } from "../../utils/asyncHandler.js";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: `${process.env.DATABASE_URL}?sslmode=require`,
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
        const { table, data } = req.body;
        const parsedData = JSON.parse(data); // Parse the raw JSON data
        const schemaName = 'monthlyDeposits';

        await createSchemaIfNotExists(schemaName);
        await createTableIfNotExists(schemaName, table);

        const query = `
            INSERT INTO ${schemaName}.${table} (name, address, phone, fc_no, pan, amount)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await pool.query(query, [
            parsedData.name,
            parsedData.address,
            parsedData.phone,
            parsedData.fc_no,
            parsedData.pan,
            parsedData.amount,
        ]);

        return res.status(201).json({
            message: "Deposit exported successfully",
        });
    } catch (gsError) {
        console.error("Error exporting deposit:", gsError.message);
        return res.status(500).json({
            message: "Deposit failed to export.",
            error: gsError.message,
        });
    }
});
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