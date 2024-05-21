import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';

// add a course 
const course = async(req, res) => {
    try {
        const { status, price, title, categories, details, QNA, resourses, date, level, studentlimit, author, image, authorId} = req.body;
        const id = uuidv4();
        pool.query('INSERT INTO courses (id, status, price, title, categories, details, QNA, resourses, level, studentlimit, author, image, authorId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', [id, status, price, title, categories, details, QNA, resourses, level, studentlimit, author, image, authorId],
        (error, result) => {
            if (error) {
                return res.status(201).json({ message: 'Failed to add course' });
            } else {
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
        return res.status(400).json({ message: 'Internal server error' });
    }
};

// get specific courses 
const specificCourses = async(req, res) => {
    try {
        const { id } = req.params;
        const users = await pool.query('SELECT * FROM courses WHERE authorId = $1', [id]);
        if(users.rows.length > 0){
            res.status(200).json({message: "Specific courses are returned", data: users.rows[0] });
        }else{
            res.status(201).json({message: "No course available"});
        }
        
    } catch (error) {
        return res.status(400).json({ message: 'Internal server error' });
    }
};

// delete courses 
const deleteCourses = async(req, res) => {
    try {
        const { id } = req.params;
        const deleteQuery = 'DELETE FROM courses WHERE id = $1';
        const result = await pool.query(deleteQuery, [id]);
      
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No course found' });
        }
        res.status(200).json({ message: 'Course deleted successfully.' });
    } catch (error) {
        res.status(400).json({ message: 'Internal server error' });
    }
};

// edit course 
const editCourses = async(req, res) => {
 try {
    let { price, title, categories, details, qna, resourses, date, level, studentlimit, image } = req.body;
    const { id } = req.params;

const updateQuery = {
    text: `UPDATE courses 
           SET price = $1,
            title = $2,
            categories = $3,
            details = $4,  
            qna = $5,
            resourses = $6,
            date = $7,
            level = $8,
            studentlimit = $9,
            image = $10
           WHERE id = $11
           RETURNING *`,
    values: [price, title, categories, details, qna, resourses, date, level, studentlimit, image, id],
    };
    const result = await pool.query(updateQuery);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ message: 'Course deleted successfully.', data: result.rows[0]});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
 
};

// change publish status 
const statusCourses = async(req, res) => {
    try {
        let { status } = req.body;
        const { id } = req.params;
        const updateQuery = {
            text: `UPDATE courses 
                   SET status = $1
                   WHERE id = $2
                   RETURNING *`,
            values: [status, id],
            };
            const result = await pool.query(updateQuery);
            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Course not found" });
            }
            res.status(200).json({ message: 'Course status update successfully.', data: result.rows[0].status});
        
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
};





export {
    course, 
    allCourses,
    specificCourses,
    deleteCourses,
    editCourses,
    statusCourses,

};