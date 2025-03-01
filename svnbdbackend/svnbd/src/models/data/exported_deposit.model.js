import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const exportedDepositSchema = new Schema({
    serial_id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    address: {
        type: String,
        lowercase: true,
    },
    phone: {
        type: Number,
    },
    fc_no: {
        type: String,
        required: true,
    },
    pan: {
        type: String,
        required: true,
        lowercase: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const exportedDeposit = model('exportedDeposit', exportedDepositSchema);

export default exportedDeposit;