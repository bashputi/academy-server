import express from "express";
import cors from "cors";


const app = express();
const PORT =process.env.PORT || 3001;

app.use(express.json());
app.use(cors());


import userRouter from './routes/user.router.js';
import settingRouter from './routes/settings.route.js';
import coursesRoute from './routes/courses.route.js';
import instructorRoute from './routes/instructor.route.js';
import enrollRoute from './routes/enroll.route.js';
import wishlistRoute from './routes/wishlist.route.js';
import categoriesRoute from './routes/categories.route.js';

app.use("/user", userRouter)
app.use("/user", settingRouter)
app.use("/admin", coursesRoute)
app.use("/instructor", instructorRoute)
app.use("/student", enrollRoute)
app.use("/student", wishlistRoute)
app.use("/admin", categoriesRoute)




app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Welcome to Solar Academy Backend")
})