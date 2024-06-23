import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';
import catchAsync from '../utils/catchAsync.js';

// enroll courses 
const enrollCourses = catchAsync(async(req, res) => {
       const { studentId, studentName, studentEmail, courseId, courseTitle, coursePrice} = req.body;
       const id = uuidv4();
       
       pool.query('INSERT INTO enroll (id, studentId, studentName, studentEmail, courseId, courseTitle, coursePrice) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [id, studentId, studentName, studentEmail, courseId, courseTitle, coursePrice],
       (error, result) => {
           if (error) {
               return res.status(201).json({ message: 'Enrollment failed' });
           } else {

            
               return res.status(200).json({ message: 'Enrollment successfully', course: result.rows[0] });
           }
       });
   });

// get all enroll 
const getEnroll = catchAsync(async(req, res) => {
        const users = await pool.query("SELECT * FROM enroll;")
        res.status(200).json({message: "Enrolled students information returned", data: users.rows[0]});
});

//get specific emrollment
const specificEnrollment = catchAsync(async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM enroll WHERE id = $1', [id]);
    res.status(200).json({message: "Specific user is returned", data: users.rows[0] });
});


export {
  
    enrollCourses,
    getEnroll,
    specificEnrollment,

};