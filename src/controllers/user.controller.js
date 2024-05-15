import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';


const secretKey = process.env.ACCESS_TOKEN_SECRET;

// user register 
const registerUser = async(req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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
const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: 'rimeislam672@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully')
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

// user login 
const login = async(req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({ error: error.message });;
    }  
};

//Verify OTP
const verifyOtp = async(req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// google and facebook login 
const socialLogin = async(req, res) => {
    try {
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
                    console.log(user)
                    bcrypt.compare(password, user.password, async(err, isMatch) => {
                        if (err) {
                            console.log("Error comparing password", err);
                            return res.status(400).json({ error: 'Server error occurred' });
                        }
                        if (isMatch) {
                            const otp = generateOTP();
                    console.log(otp)   
                const updateQuery = {
                    text: `UPDATE student 
                           SET otp = COALESCE($1, otp)
                           WHERE email = $2
                           RETURNING *`,
                    values: [otp, email],
                };
                const result = await pool.query(updateQuery);
                if (result.rows.length > 0) {
                    await sendOTP(email, otp);
                   res.status(200).json({
                        status: 201,
                        success: true,
                        message: "Verify OTP for Vrification",
                      });
                      return 
                }
                        } else {
                            return res.status(400).json({
                                status: 400,
                                message: "Email already used!!",
                            });
                        }
                    });
                } else {
                    const otp = generateOTP();
                    console.log(otp)
                    pool.query(
                        `INSERT INTO student (id, firstname, lastname, username, email, password, role, otp)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        returning *`, [id, firstname, lastname, username, email, hashedPassword, role, otp],
                        async(err, results) => {
                            if (err) {
                                console.log("Error inserting user", err);
                                return res.status(500).json({ error: 'Server error occurred' });
                            }
                            if (results.rows.length > 0) {
                                const user = results.rows[0];
                                console.log(user.email)
                                await sendOTP(user.email, otp);
                               res.status(200).json({
                                    status: 201,
                                    success: true,
                                    message: "Verify OTP for Vrification",
                                  });
                                  return 
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        res.status(400).json({ error: 'Server error occurred' });
    }
};




export {
    registerUser,
    login,
    verifyOtp,
    socialLogin,

};