import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';

// add a course 
const course = async(req, res) => {
    try {
        const { title, categories, details, QNA, resourses, date, level, limited, author, image} = req.body;
        const id = uuidv4();
        console.log({ title, categories, details, QNA, resourses, date, level, limited, author, image });
        
        pool.query('INSERT INTO courses (id, title, categories, details, QNA, resourses, date, level, limited, author, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', [id, title, categories, details, QNA, resourses, date, level, limited, author, image],
        (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(201).json({ message: 'Failed to add course' });
            } else {
                console.log('Inserted course:', result.rows[0]);
                return res.status(200).json({ message: 'Course added successfully', course: result.rows[0] });
            }
        });
    } catch (error) {
        return res.status(400).json({ message: 'Internal server error' });
    }
};

// get all courses 
const allCourses = async(req, res) => {
    try {
        const users = await pool.query("SELECT * FROM courses;")
        res.status(200).json({message: "Course are returned", data: users.rows});
    } catch (error) {
        res.json({error: error.message}); 
    }
};




export {
    course, 
    allCourses,
};