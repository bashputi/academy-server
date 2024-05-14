import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';


const registerUser = async(req, res) => {
    try {
        let {firstname, lastname, username, email, password, role, date} = req.body;
        const id = uuidv4();
        let hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
            `SELECT * FROM student WHERE email = $1`, [email],
            (err, results) => {
                if(err){
                    throw err;
                }
                if(results.rows.length > 0){
                    res.status(400).json({
                        status: 400,
                        message: "Email already used!!",
                      });
                      return;
                }else{
                    pool.query(
                        `SELECT * FROM student WHERE username = $1`, [username],
                        (err, results) => {
                            if(err){
                                throw err;
                            }
                            if(results.rows.length > 0){
                                res.status(400).json({
                                    status: 400,
                                    message: "User Name already used!!",
                                });
                                return;
                            }else{
                                pool.query(
                                    `INSERT INTO student (id, firstname, lastname, username, email, password, role)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                                    returning *`, [id, firstname, lastname, username, email, hashedPassword, role],
                                    (err, results) => {
                                        if (err){
                                            throw err;
                                        }
                                        if(results.rows.length > 0){
                                            res.status(200).json({
                                                status: 201,
                                                success: true,
                                                message: "User Created Successfully",
                                              });
                                        } }) 
                            }
                        }
                    )
               
                }}  );
    } catch (error) {
        res.json({error: error.message});
    }
};


export {
    registerUser
};