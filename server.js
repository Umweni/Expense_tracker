import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app = express();

//connect database
const connectDB = async (req, res) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected Successful: ${conn.connection.host} `)
    } catch (error) {
        console.error('failed to connect to MongoDB', error);
        process.exit(1);
    }
};

connectDB();

//middleware
app.use(express.json());
app.use(cors());

//mount routes


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});