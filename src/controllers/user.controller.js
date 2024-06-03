import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import catchAsync from '../utils/catchAsync.js';


const secretKey = process.env.ACCESS_TOKEN_SECRET;

// user register 
const registerUser = catchAsync(async(req, res) => {
        let {firstname, lastname, username, email, password, role} = req.body;
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
   
});

// node mailer to send email 
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rimeislam672@gmail.com',
        pass: 'unop cgid uawx fgbo'
    }
});

//Generate OTP
const generateOTP = () => {
    const digits = '0123456789';
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
//send OTP via Email
const sendOTP = catchAsync(async (email, otp) => {
        const mailOptions = {
            from: 'rimeislam672@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully')
});

// user login 
const login = catchAsync(async(req, res) => {
        let {email, password} = req.body;
        console.log({email, password})
        pool.query(
            `SELECT * FROM student WHERE email = $1 OR username = $1`,
            [email],
            async (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.rows.length > 0) {
                    const user = results.rows[0];
        
                    bcrypt.compare(password, user.password, async (err, isMatch) => {
                        if (err) {
                            console.log("Error comparing passwords:", err);
                            return res.status(400).json({ status: 400, message: "Server error" });
                        }
                        if (isMatch) {
                            const otp = generateOTP();
                            console.log(otp);
                           
                            const updateQuery = {
                                text: `UPDATE student 
                                       SET otp = COALESCE($1, otp)
                                       WHERE email = $2
                                       RETURNING *`,
                                values: [otp, user.email],
                            };
                            const result = await pool.query(updateQuery);
                            if (result.rows.length > 0) {
                                await sendOTP(user.email, otp);
                                return res.status(200).json({
                                    status: 200,
                                    success: true,
                                    message: "Verify OTP for Verification",
                                });
                            }
                        } else {
                            return res.status(400).json({ status: 400, message: "Password is incorrect" });
                        }
                    });
                } else {
                    return res.status(400).json({ status: 400, message: "Email or username does not exist" });
                }
            }
        ); 
});

//Verify OTP
const verifyOtp = catchAsync(async(req, res) => {
        const { email, otp } = req.body;
        console.log({ email, otp } )
        pool.query("SELECT * FROM student WHERE email = $1 OR username = $1 AND otp = $2", [email, otp], async (err, results) => {
            if (err) {
              throw err;
            }
            if (results.rows.length > 0) {
              const user = results.rows[0];

              const token = jwt.sign({
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                 email: user. email,
                 role: user.role,
                 date: user.date
              } , secretKey, { expiresIn: '30day' });

              res.status(200).json({ token, success: true, message: "Logged in Successfully" });
            } else {
              res.status(400).json({ status: 400, message: "OTP verification failed" });
            }
          });
});

// google and facebook login 
const socialLogin = catchAsync(async(req, res) => {
        let { firstname, lastname, username, email, password, role } = req.body;
        const id = uuidv4();
        let hashedPassword = await bcrypt.hash(password, 10);
       
        pool.query(
            `SELECT * FROM student
            WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    console.log('server error', err);
                    return res.status(400).json({ error: 'Server error occurred' });
                }
                if (results && results.rows.length > 0) {
                    const user = results.rows[0];
                    bcrypt.compare(password, user.password, async(err, isMatch) => {
                        if (err) {
                            console.log("Error comparing password", err);
                            return res.status(400).json({ error: 'Server error occurred' });
                        }
                        if (isMatch) {
                      res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Verified user",
                      });
                      return 
                      }
                        else {
                            return res.status(400).json({
                                status: 400,
                                message: "Email already used!!",
                            });
                        }
                    });
                } else {
                    pool.query(
                        `INSERT INTO student (id, firstname, lastname, username, email, password, role)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        returning *`, [id, firstname, lastname, username, email, hashedPassword, role],
                        async(err, results) => {
                            if (err) {
                                console.log("Error inserting user", err);
                                return res.status(500).json({ error: 'Server error occurred' });
                            }
                            if (results.rows.length > 0) {
                                const user = results.rows[0];
                  
                               res.status(200).json({
                                    status: 200,
                                    success: true,
                                    message: "Create user",
                                  });
                                  return 
                            }
                        }
                    );
                }
            }
        );
});

// get user by id
const user = catchAsync(async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM student WHERE id = $1', [id]);
    res.status(200).json({message: "Specific user is returned", data: users.rows[0] });
});

// get all user information 
const students = catchAsync(async(req, res) => {
    const result = await pool.query('SELECT * FROM student WHERE role = $1', ['student']);
    console.log(result.rows)
    res.json({ message: 'Students are returned', data: result.rows });
});







export {
    registerUser,
    login,
    verifyOtp,
    socialLogin,
    students,
    user,
    
};