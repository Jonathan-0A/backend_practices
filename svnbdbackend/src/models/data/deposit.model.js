import mongoose, { Schema } from 'mongoose';

const depositSchema = new Schema({
    serial_id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
    },
    fc_no: {
        type: String,
        required: true
    },
    pan: {
        type: String,
        required: true
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