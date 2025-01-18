import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

export const getMember = async (req, res) => {
    try {
        // Set up Google Sheets API authentication
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json", // Path to your service account JSON file
            scopes: "https://www.googleapis.com/auth/spreadsheets", // Required scope
        });

        const client = await auth.getClient(); // Get authenticated client
        const googleSheets = google.sheets({ version: "v4", auth: client });

        // Specify spreadsheet ID
        const spreadsheetId = process.env.MEMBER_SHEET_ID || "1_WI_q_W2CGf9Ep2AK6MpBfURURS3o_c5NxWljZBuKhQ";

        // Fetch the header row (first row of the sheet)
        const headerResponse = await googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range: "infoDatabase!A1:Z1", // Fetch only the header row
        });
        const headers = headerResponse.data.values[0]; // Extract the headers

        // Fetch the data rows (starting from the second row)
        const dataResponse = await googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range: "infoDatabase!A2:Z", // Fetch the data rows
        });
        const rows = dataResponse.data.values || [];

        // Format the data into an array of objects
        const formattedData = rows.map((row) => {
            const rowObject = {};
            headers.forEach((header, index) => {
                // Transform the header to lowercase and replace spaces with underscores
                const formattedHeader = header.split(" ").join("_").toLowerCase();
                // Assign the value to the formatted header, or null if undefined
                rowObject[formattedHeader] = row[index] ? row[index].toLowerCase() : null;
            });
            return rowObject;
        });        

        // Respond with the formatted data
        res.status(200).json({
            // status: "success",
            message: "Data retrieved successfully",
            data: formattedData,
        });
    } catch (error) {
        console.error("Error fetching Google Sheets data:", error.stack);
        res.status(500).json({
            message: "An error occurred while fetching the data.",
            error: error.message,
        });
    }
};
