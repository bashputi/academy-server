import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';
import catchAsync from '../utils/catchAsync.js';
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


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
const allCourses = catchAsync(async (req, res) => {
    const page = Number(req.query.page) || 1; // Get the page number from the query parameters, default to 1
    const limit = Number(req.query.limit) || 1; // Get the limit from the query parameters, default to 12
    const offset = (page - 1) * limit; // Calculate the offset

    try {
        // Query to get total count of categories
        const countResult = await pool.query("SELECT COUNT(*) AS total FROM categories");
        const totalCategories = parseInt(countResult.rows[0].total, 10);

        // Query to get categories with pagination
        const query = `SELECT * FROM categories LIMIT $1 OFFSET $2`;
        const values = [limit, offset];

        // Execute the query
        const result = await pool.query(query, values);
        const categories = result.rows;

        if (categories.length === 0) {
            throw new ApiErrors(404, "Categories not found");
        }

        const data = {
            totalCategories,
            categories,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / limit)
        };

        return res.status(200).json(new ApiResponse(200, data, "Categories retrieved successfully"));
    } catch (error) {
        console.error("Error retrieving categories:", error.message);
        res.status(500).json({ message: "Error retrieving categories", error: error.message });
    }
});

// get specific courses by id
const specificCategories = catchAsync(async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM categories WHERE authorId = $1', [id]);
    if(users.rows.length > 0){
        res.status(200).json({message: "Specific categories are returned", data: users.rows[0] });
    }else{
        res.status(201).json({message: "No categories available"});
    }
});

// edit categories
const editCategories = catchAsync(async(req, res) => {
    const { authorId , icone, Title} = req.body;
    const { id } = req.params;

const updateQuery = {
    text: `UPDATE categories 
           authorId price = $1,
            icone = $2,
            Title = $3,
           WHERE id = $4
           RETURNING *`,
    values: [authorId, icone, Title, id],
    };
    const result = await pool.query(updateQuery);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Categories not found" });
    }
    res.status(200).json({ message: 'Categories edited successfully.', data: result.rows[0]});
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
    specificCategories,
    editCategories,
    deleteCourses,


};