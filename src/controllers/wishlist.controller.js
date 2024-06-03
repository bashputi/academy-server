import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';
import catchAsync from '../utils/catchAsync.js';


// create wishlist 
const addWish = catchAsync(async(req, res) => {
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
});

//get wishlist by author id
const specificWishlist = catchAsync(async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM wishlist WHERE id = $1', [id]);
    res.status(200).json({message: "Specific user is returned", data: users.rows[0] });
});


export {
    addWish,
    specificWishlist,

};