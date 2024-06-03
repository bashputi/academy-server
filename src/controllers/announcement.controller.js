import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';



// add to announcement
const addAnnouncement = async(req, res) => {
 try { 
    const { course_name, summary, Title} = req.body;
    const id = uuidv4();
    console.log({ id,course_name, summary, Title });
    
    pool.query('INSERT INTO announcement (id, course_name, summary, Title) VALUES ($1, $2, $3, $4) RETURNING *', [id, course_name, summary, Title],
    (error, result) => {
        if (error) {
            return res.status(201).json({ message: 'Announcement failed' });
        } else {
            return res.status(200).json({ message: 'Announcement added successfully', course: result.rows[0] });
        }
    });
 } catch (error) {
    res.status(400).json({ error: error.message });
 }
};

//get announcement by course name
const announc = async(req, res) => {
    try {
        const { course_name } = req.params;
        const users = await pool.query('SELECT * FROM announcement WHERE course_name = $1', [course_name]);
        if(users.rows.length > 0){
            res.status(200).json({message: "These are your announcement.", data: users.rows[0] });
        }else{
            res.status(201).json({message: "No announcement found" });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Internal server error' });  
    }
};


export {
  
    addAnnouncement,
    announc,

};