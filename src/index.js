import express from "express";
import cors from "cors";
import userRouter from './routes/user.router.js';
import settingRouter from './routes/settings.route.js';
import coursesRoute from './routes/courses.route.js';
import instructorRoute from './routes/instructor.route.js';
import enrollRoute from './routes/enroll.route.js';
import wishlistRoute from './routes/wishlist.route.js';
import categoriesRoute from './routes/categories.route.js';
import announcementRoute from './routes/announcement.route.js';
import blogRoute from './routes/blog.route.js';
import emailRoute from './routes/email.route.js';
import globalErrorHandler from './middlewares/globalErrorhandler.js'
import notFound from './middlewares/notFound.js'


const app = express();
const PORT =process.env.PORT || 3001;

app.use(express.json());
app.use(cors());


app.use("/api/user", userRouter)
app.use("/api/user", settingRouter)
app.use("/api/admin", coursesRoute)
app.use("/api/instructor", instructorRoute)
app.use("/api/student", enrollRoute)
app.use("/api/student", wishlistRoute)
app.use("/api/admin", categoriesRoute)
app.use("/api/admin", announcementRoute)
app.use("/api/admin", blogRoute)
app.use("/api/email", emailRoute)





app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Welcome to Solar Academy Backend")
})

// global error handler
app.use(globalErrorHandler);

// Not Found route
app.use(notFound);