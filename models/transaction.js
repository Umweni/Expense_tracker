import mongoose from "mongoose";
import User from "./User";

const transactionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type:{
        type: String,
        enum: ["income", "expense"],
        default: "expense",
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    note:{type: String}
},{timestamps: true});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;