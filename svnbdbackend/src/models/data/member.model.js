import { Schema, model } from 'mongoose';

const memberSchema = new Schema({
    serial_id: {
        type: Number,
        required: true,
        unique: true
    },
    dp_serial: {
        type: Number,
        default: null
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
        type: String,
        default: 0
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        default: 0
    },
    adhaar: {
        type: Number,
        default: 0
    },
    pan: {
        type: String,
        default: 0
    },
    dp_status: {
        type: String,
        default: "FW Pending",
        enum: ["FW Pending", "FW Completed", "DA Pending", "DA Approved", "DA Rejected", "SU Pending", "SU Approved", "SU Rejected"]
    },
    dikshyarti: {
        type: String,
        default: "Yes",
        enum: ["Yes", "No"]
    },
    swastayani: {
        type: String,
        default: "No",
        enum: ["Yes", "No"]
    },
    initiation_date: {
        type: Date,
        default: 0
    }
}, { timestamps: true });

const Member = model('Member', memberSchema);

export default Member;