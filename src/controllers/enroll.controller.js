import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';


// enroll courses 
const enrollCourses = async(req, res) => {
 try {
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
 } catch (error) {
    res.status(400).json({ error: error.message }); 
 }
};

// get all enroll 
const getEnroll = async(req, res) => {
    try {
        const users = await pool.query("SELECT * FROM enroll;")
        res.status(200).json({message: "Enrolled students information returned", data: users.rows[0]});
    } catch (error) {
        return res.status(400).json({ message: 'Internal server error' });
    }
};

//get specific emrollment
const specificEnrollment = async(req, res) => {
    try {
        
        const { id } = req.params;
        const users = await pool.query('SELECT * FROM enroll WHERE studentId = $1', [id]);
        if(users.rows.length > 0){
            res.status(200).json({message: "These are your enrolled courses.", data: users.rows[0] });
        }else{
            res.status(201).json({message: "No enrolled courses" });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Internal server error' });  
    }
};



export {
  
    enrollCourses,
    getEnroll,
    specificEnrollment,

};