import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const exportedDepositSchema = new Schema({
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
    table: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const exportedDeposit = model('exportedDeposit', exportedDepositSchema);

export default exportedDeposit;