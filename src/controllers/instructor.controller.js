import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';


const secretKey = process.env.ACCESS_TOKEN_SECRET;

// appication as instructor
const appication = async(req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({ error: 'Internal server error' }); 
    }
};

//get the instructors and the applicators
const instructor = async (req, res) => {
    try {
      console.log("feee");
      const roles = ['instructor', 'applicator'];
      const result = await pool.query('SELECT * FROM student WHERE role = ANY($1::text[])', [roles]);
      console.log(result.rows); 
      res.json({ message: 'Instructors and applications are returned', data: result.rows }); 
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// accept or declined instructor request 
const instructorRequest = async(req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const results = await pool.query('UPDATE student SET role = $1 WHERE id = $2 RETURNING *', [role, id]);
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Internal server error' });
    }
};





export {
    appication,
    instructor,
    instructorRequest,

};