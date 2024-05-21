import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';



// add to wishlist 
const addWish = async(req, res) => {
 try {
    const { courseId, authorId, authorName, courseTitle, category, rating, complete} = req.body;
    const id = uuidv4();
    console.log({ id, courseId, authorId, authorName, courseTitle, category, rating, complete });
    
    pool.query('INSERT INTO wishlist (id, courseId, authorId, authorName, courseTitle, category, rating, complete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [id, courseId, authorId, authorName, courseTitle, category, rating, complete],
    (error, result) => {
        if (error) {
            return res.status(201).json({ message: 'Add to wishlist failed' });
        } else {
            return res.status(200).json({ message: 'Add to wishlist successfully', course: result.rows[0] });
        }
    });
 } catch (error) {
    res.status(400).json({ error: error.message });
 }
};


export {
  
    addWish,

};