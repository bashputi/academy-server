import express from "express";
import cors from "cors";



const app = express();
const PORT =process.env.PORT || 3001;

app.use(express.json());
app.use(cors());


import userRouter from './routes/user.router.js';

app.use("/user", userRouter)










app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Welcome to Solar Academy Backend")
})