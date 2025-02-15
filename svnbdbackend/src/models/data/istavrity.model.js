import { Schema, model } from "mongoose";

const istavritySchema = new Schema({
    serial_no: {
        type: Number,
        required: true,
        default: 0
    },
    fc_no: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    address: {
        type: String,
        default: null,
        lowercase: true
    },
    phone: {
        type: Number,
        default: 0,
    },
    amount: {
        type: Number,
        required: true,
    },
    last_istavrity: {
        type: Date,
    },
}, { timestamp: true });

const Istavrity = model("Istavrity", istavritySchema);

export default Istavrity;