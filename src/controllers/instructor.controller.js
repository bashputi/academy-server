import pool from "../db/db.js";
import nodemailer from 'nodemailer';
import catchAsync from '../utils/catchAsync.js';

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
      console.log("feee");
      const roles = ['instructor', 'applicator'];
      const result = await pool.query('SELECT * FROM student WHERE role = ANY($1::text[])', [roles]);
      console.log(result.rows); 
      res.json({ message: 'Instructors and applications are returned', data: result.rows }); 
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