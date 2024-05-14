import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config()
import pool from "./db/db.js";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Welcome to Solar Academy Backend")
})