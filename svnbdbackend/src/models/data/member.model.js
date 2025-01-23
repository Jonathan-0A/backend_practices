import { Schema, model } from 'mongoose';

const memberSchema = new Schema({
    dp_serial: {
        type: Number
    },
    fc_no: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rittwik: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    adhaar: {
        type: Number
    },
    pan: {
        type: Number
    },
    dp_status: {
        type: String,
        default: "FW Pending"
    },
    dikshyarti: {
        type: String,
        default: "Yes"
    },
    swastayani: {
        type: String,
        default: "No"
    },
    initiation_date: {
        type: Date
    },
}, { timestamps: true });
const Member = model('Member', memberSchema);

export default Member;