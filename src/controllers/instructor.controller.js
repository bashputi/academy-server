import pool from "../db/db.js";
import nodemailer from 'nodemailer';
import catchAsync from '../utils/catchAsync.js';
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// appication as instructor
const appication = catchAsync(async(req, res) => {
        const { id } = req.params;
        const {role} = req.body;
     
        const updateQuery = {
        text: `UPDATE student SET role= $1
            WHERE id = $2 RETURNING *`, values: [role, id],};
        const result = await pool.query(updateQuery);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Update faild" });
        }
        res.status(200).json({ status: 200, message: "Get application successfully" });
});

//get the instructors and the applicators
const instructor = catchAsync(async (req, res) => {
    const { status, category, date, search } = req.body;
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder || 'ASC';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    let roles;

    // Determine roles based on status
    if (status === 'pending') {
        roles = ['applicator'];
    } else if (status === 'approved') {
        roles = ['instructor'];
    } else {
        roles = ['instructor', 'applicator'];
    }

    try {
        // Base query to fetch students based on roles
        let query = `
            SELECT *
            FROM student
            WHERE role = ANY($1::text[])
        `;

        let countQuery = `
            SELECT COUNT(*) AS total
            FROM student
            WHERE role = ANY($1::text[])
        `;

        let filters = [];
        let values = [roles];

        // Add additional filters
        if (category) {
            filters.push(`category = $${values.length + 1}`);
            values.push(category);
        }
        if (date) {
            filters.push(`DATE(date) = $${values.length + 1}`);
            values.push(date);
        }
        if (search) {
            filters.push(`(
                firstname ILIKE $${values.length + 1} OR 
                role ILIKE $${values.length + 1} OR 
                email ILIKE $${values.length + 1}
            )`);
            values.push(`%${search}%`);
        }

        // Add WHERE clause if there are additional filters
        if (filters.length > 0) {
            const whereClause = filters.join(' AND ');
            query += ` AND ${whereClause}`;
            countQuery += ` AND ${whereClause}`;
        }

        // Add sorting
        query += ` ORDER BY ${sortBy} ${sortOrder}`;

        // Add pagination
        query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset);

        // Execute the query to fetch students
        const result = await pool.query(query, values);
        const instructors = result.rows;

        // Execute the count query to get total count of instructors
        const countResult = await pool.query(countQuery, values.slice(0, filters.length + 1));
        const totalInstructors = parseInt(countResult.rows[0].total, 10);

        if (instructors.length === 0 && totalInstructors === 0) {
            throw new ApiErrors(404, "Instructors not found");
        }

        const data = {
            totalInstructors,
            instructors,
            currentPage: page,
            totalPages: Math.ceil(totalInstructors / limit)
        };

        return res.status(200).json(new ApiResponse(200, data, "Instructors retrieved successfully"));
    } catch (error) {
        console.error("Error retrieving instructors:", error.message);
        return res.status(500).json({ message: "Error retrieving instructors", error: error.message });
    }
});



// accept or declined instructor request 
const instructorRequest = catchAsync(async(req, res) => {
        const { id } = req.params;
        const { role } = req.body;
        const results = await pool.query('UPDATE student SET role = $1 WHERE id = $2 RETURNING *', [role, id]);
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'Status updated successfully' });
});





export {
    appication,
    instructor,
    instructorRequest,

};