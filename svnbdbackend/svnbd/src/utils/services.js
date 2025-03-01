export const depositMapper = (deposits) => {
    return deposits.map(deposit => ({
        serial_id: deposit.serial_id,
        name: deposit.name,
        amount: deposit.amount,
        fc_no: deposit.fc_no,
        createdAt: deposit.createdAt,
        updatedAt: deposit.updatedAt,
    }));
};

export const exportMapper = (deposits) => {
    return deposits.map(deposit => ({
        serial_id: deposit.serial_id,
        name: deposit.name,
        amount: deposit.amount,
        fc_no: deposit.fc_no,
        createdAt: deposit.createdAt,
        updatedAt: deposit.updatedAt,
    }));
};

export const sanitizeData = (data) => {
    return data.map(item => {
        const sanitizedItem = { ...item };
        delete sanitizedItem._id;
        delete sanitizedItem.__v;
        return sanitizedItem;
    });
};

export const memberMapper = (members) => {
    return members.map(member => ({
        serial_id: member.serial_id,
        dp_serial: member.dp_serial,
        fc_no: member.fc_no,
        name: member.name,
        rittwik: member.rittwik,
        address: member.address,
        phone: member.phone,
        adhaar: member.adhaar,
        pan: member.pan,
        dp_status: member.dp_status,
        dikshyarti: member.dikshyarti,
        swastayani: member.swastayani,
        initiation_date: member.initiation_date,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
    }));
};