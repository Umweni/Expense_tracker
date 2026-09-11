import express from "express";
import {createTransaction, getTransactions, getSummary, deleteTransaction} from "../controllers/transactionController.js";

// Middleware that ensures user is authenticated
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new transaction
router.post("/createTransaction", protect, createTransaction);

// Fetch transactions (with optional filters: month, year, type, category)
router.get("/getTransactions", protect, getTransactions);

// Fetch summary (income, expense, balance, category breakdown)
router.get("/summary", protect, getSummary);

// Delete a transaction by ID
router.delete("/:id", protect, deleteTransaction);

export default router;
