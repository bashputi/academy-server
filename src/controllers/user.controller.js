import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';
import catchAsync from '../utils/catchAsync.js';
import { sendOTP } from "../utils/email.js";
import { resetPassword } from "../utils/email.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiErrors } from "../utils//apiError.js";

export const secretKey = process.env.ACCESS_TOKEN_SECRET;

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
                    throw new ApiErrors(400, "Email already used!!");
                }else{
                    pool.query(
                        `SELECT * FROM student WHERE username = $1`, [username],
                        (err, results) => {
                            if(err){
                                throw err;
                            }
                            if(results.rows.length > 0){
                                throw new ApiErrors(400, "User Name already used!!");
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
                                            return res.status(200).json(
                                                new ApiResponse(200, { results }, "User registered Successfully")
                                            ) 
                                        } }) 
                            }
                        }
                    )
               
                }}  );
   
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

// user login 
const login = catchAsync(async (req, res) => {
    let { email, password } = req.body;
    pool.query(
        `SELECT * FROM student WHERE email = $1 OR username = $1`,
        [email],
        async (err, results) => {
            if (err) {
                throw err;
            }
            if (results.rows.length > 0) {
                const user = results.rows[0];
                const email = results.rows[0].email;
                const name = results.rows[0].username

                bcrypt.compare(password, user.password, async (err, isMatch) => {
                    if (err) {
                        console.log("Error comparing passwords:", err);
                        throw new ApiErrors(500, "Server error");
                    }
                    if (isMatch) {
                        const otp = generateOTP();
                        console.log(otp);

                        const updateQuery = {
                            text: `UPDATE student 
                                   SET otp = $1
                                   WHERE email = $2
                                   RETURNING *`,
                            values: [otp, user.email],
                        };
                        const result = await pool.query(updateQuery);
                  
                        if (result.rows.length > 0) {
                            await sendOTP(email, otp, name);
                            return res.status(200).json(new ApiResponse(200, user, "Verify OTP for Verification"));
                        }
                    } else {
                        throw new ApiErrors(400, "Password is incorrect");
                    }
                });
            } else {
                throw new ApiErrors(404, "Email or username does not exist");
            }
        }
    );
});

//Verify OTP
const verifyOtp = catchAsync(async(req, res) => {
        const { user, otp } = req.body;
        console.log({ user, otp } )
        pool.query("SELECT * FROM student WHERE email = $1 OR username = $1 AND otp = $2", [user, otp], async (err, results) => {
            if (err) {
              throw err;
            }
            if (results.rows.length > 0) {
              const user = results.rows[0];

              const token = jwt.sign({
                username: user.username,
                 email: user. email,
                 role: user.role,
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

// send email for forget password
const forgetPassword = catchAsync(async(req, res) => {
    const { user } = req.body;

    pool.query(`SELECT * FROM student WHERE email = $1 OR username = $1`,
        [user],
        async (err, results) => {
            if (err) {
                throw err;
            }
            if (results.rows.length > 0) {
                const user = results.rows[0];
                const id = user.id;
                const name = user.firstname + ' ' + user.lastname;
                const email = user.email;

                const token = jwt.sign({email: user. email} , secretKey, { expiresIn: '1day' });
                const url = `http://localhost:5173/reset-password/${id}/${token}`

               await resetPassword(email, url, name);
               return res.status(200).json({
                status: 200,
                success: true,
                message: "Password reset email sent successfully.",
            });

            }else {
               return res.status(404).json({message: "User not found"});
            }
        })
});

// send email for forget password
const changePassword = catchAsync(async(req, res) => {
    const { id, token, password } = req.body;

    jwt.verify(token, secretKey, async(err, decoded) => {
        if(err) {
            return res.json({status: 400, message: "Invalid user"})
        } else {
            let hashedPassword = await bcrypt.hash(password, 10);
            if (hashedPassword) {
                await pool.query(`UPDATE student SET password = $1 WHERE id = $2`, [hashedPassword, id]);
                res.status(200).json({ message: 'Password updated successfully' });
            } else {
                res.status(400).json({ message: 'Password updated faild' });
            }

        }
    })
 
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
    forgetPassword,
    changePassword
    
};