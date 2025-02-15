import mongoose, { Schema } from 'mongoose';

const depositSchema = new Schema({
    serial_id: {
        type: Number,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    address: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: Number,
    },
    fc_no: {
        type: String,
        required: true,
        lowercase: true
    },
    pan: {
        type: String,
        required: true,
        lowercase: true
    },
    amount: {
        type: Number,
        required: true
    },
    last_deposit: {
        type: Date
    }
}, { timestamps: true });

const Deposit = mongoose.model('Deposit', depositSchema);

export default Deposit;