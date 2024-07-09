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


app.use("/api", userRouter)
app.use("/api", settingRouter)
app.use("/api", coursesRoute)
app.use("/api", instructorRoute)
app.use("/api", enrollRoute)
app.use("/api", wishlistRoute)
app.use("/api", categoriesRoute)
app.use("/api", announcementRoute)
app.use("/api", blogRoute)
app.use("/api", emailRoute)





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

// api error handler 
