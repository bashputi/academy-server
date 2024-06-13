import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';
import catchAsync from '../utils/catchAsync.js';


// create wishlist 
const addcategory = catchAsync(async(req, res) => {
       const { authorId , icone, Title} = req.body;
       const id = uuidv4();
       
       pool.query('INSERT INTO categories (id, authorId , icone, Title) VALUES ($1, $2, $3, $4) RETURNING *', [id, authorId , icone, Title],
       (error, result) => {
           if (error) {
               return res.status(201).json({ message: 'Add categories failed' });
           } else {
               return res.status(200).json({ message: 'Category add successfully', course: result.rows[0] });
           }
       });
   });

// get all categories
const allCourses = catchAsync(async(req, res) => {
        const users = await pool.query("SELECT * FROM categories;")
        res.status(200).json({message: "CAtegories are returned", data: users.rows});
});

// edit categories
const editCourses = catchAsync(async(req, res) => {
        const users = await pool.query("SELECT * FROM categories;")
        res.status(200).json({message: "Categories are returned", data: users.rows});
});

// delete categories
const deleteCourses = catchAsync(async(req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM categories WHERE id = $1';
    const result = await pool.query(deleteQuery, [id]);
  
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'No categories found' });
    }
    res.status(200).json({ message: 'Categories deleted successfully.' });
});



export {
    addcategory,
    allCourses,
    editCourses,
    deleteCourses,


};