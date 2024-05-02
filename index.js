const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();
const PORT = 3002;


app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',
    ],
    credentials: true
}));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send("Welcome to solar academy backend");
});