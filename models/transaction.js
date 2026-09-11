import mongoose from "mongoose";
import User from "./User.js";

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
        required: true,
        min: [1, "Amount must be greater than 0"]
    },
    category:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    note:{
        type: String,
        maxlength: [200, "Note cannot exceed 200 characters"]
    }
},{timestamps: true});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;