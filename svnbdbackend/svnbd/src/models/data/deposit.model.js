import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const depositSchema = new Schema({
    serial_id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    fc_no: {
        type: String,
        required: true,
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

const Deposit = model('Deposit', depositSchema);

export default Deposit;