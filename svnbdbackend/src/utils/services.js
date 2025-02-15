export const getAllData = async (googleSheets, sheetId, sheetName = "infoDatabase", startRow = 2) => {
    const range = `${sheetName}!A${startRow}:Z`;
    const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
    });
    return response.data.values || [];
};
export const depositMapper = (dataArray) => {
    return dataArray.map((data) => {
        return [
            parseInt(data.serial_id, 10) || 0,
            data.name ? data.name.toUpperCase() : "",
            data.address ? data.address.toUpperCase() : "",
            data.phone ? parseInt(data.phone) : 0,
            data.fc_no ? `'${data.fc_no}` : "",
            data.pan ? data.pan.toUpperCase() : "0",
            parseInt(data.amount) || 0,
            data.createdAt
                ? new Date(data.createdAt)
                : (new Date().toISOString().split('T')[0] || "0"),
            data.updatedAt
                ? new Date(data.updatedAt)
                : (new Date().toISOString().split('T')[0] || "0"),
        ];
    });
};
export const exportMapper = (dataArray) => {
    return dataArray.map((data) => {
        return [
            Number(data.serial_id) || 0,
            data.name ? data.name.toUpperCase() : "",
            data.address ? data.address.toUpperCase() : "",
            data.phone ? Number(data.phone) : 0,
            data.fc_no ? `'${data.fc_no}` : "",
            data.pan ? data.pan.toUpperCase() : "0",
            Number(data.amount) || 0,
            data.createdAt
                ? new Date(data.createdAt)
                : (new Date().toISOString().split('T')[0] || "0"),
            data.user ? data.user.toUpperCase() : "USER",
        ];
    });
};
export const memberMapper = (dataArray) => {
    return dataArray.map((data) => {
        return [
            parseInt(data.serial_id, 10) || 0,
            parseInt(data.dp_serial, 10) || 0,
            data.fc_no ? `'${data.fc_no}` : "",
            data.name ? data.name.toUpperCase() : "",
            data.rittwik ? data.rittwik.toUpperCase() : "",
            data.address ? data.address.toUpperCase() : "",
            parseInt(data.phone) || 0,
            parseInt(data.adhaar) || 0,
            data.pan ? data.pan.toUpperCase() : "0",
            data.dp_status || "FW Pending",
            data.dikshyarti || "Yes",
            data.swastayani || "No",
            data.initiation_date
                ? new Date(data.initiation_date)
                : "0",
            data.createdAt
                ? new Date(data.createdAt)
                : "",
        ];
    });
};
export const sanitizeData = (data) => {
    return data.map((row) => {
        return row.map((value) => {
            if (value instanceof Date) {
                value = isNaN(value.getTime()) ? 0 : value.toISOString().split('T')[0];
            }
            if (typeof value === 'number' && !isNaN(value)) {
                value = value.toString().replace(/[^0-9.]/g, '');
            }
            if (typeof value === 'string' && value.startsWith("'")) {
                value = value.substring(1);
            }
            if (value === null || value === undefined) {
                value = "0";
            }

            return value;
        });
    });
};
export const renameFields = (headers) => headers.map(header => 
    header.toLowerCase().trim().replace(/\s+/g, '_')
);
