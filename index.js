const express = require("express");
const bcrypt = require("bcrypt");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const pool = require("./db");

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