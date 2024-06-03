import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';
import catchAsync from '../utils/catchAsync.js';


// add to announcement
const addAnnouncement = catchAsync(async(req, res) => {
       const { course_name, summary, title} = req.body;
       const status = "pending;"
       const id = uuidv4();
       console.log({ id,course_name, summary, title });
       
       pool.query('INSERT INTO announcement (id, course_name, summary, title, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, course_name, summary, itle, status],
       (error, result) => {
           if (error) {
               return res.status(400).json({ message: 'Announcement failed' });
           } else {
               return res.status(200).json({ message: 'Announcement added successfully', course: result.rows[0] });
           }
       });
   });

//get announcement by course name
const announc = catchAsync(async(req, res) => {
        const { course_name } = req.params;
        const users = await pool.query('SELECT * FROM announcement WHERE course_name = $1', [course_name]);
        console.log(users)
        
        if(users.rows.length > 0){
            res.status(200).json({message: "These are your announcement.", data: users.rows[0] });
        }else{
            res.status(404).json({message: "No announcement found" });
        }
});

//get announcement by id
const specificAnnouncement = catchAsync(async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM announcement WHERE id = $1', [id]);
    res.status(200).json({message: "Specific user is returned", data: users.rows[0] });
});


export {
    addAnnouncement,
    announc,
    specificAnnouncement,

};