import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import catchAsync from '../utils/catchAsync.js';
import { sendOTP } from "../utils/email.js";
import { resetPassword } from "../utils/email.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiErrors } from "../utils//apiError.js";
import prisma from "../db/db.config.js";

export const secretKey = process.env.ACCESS_TOKEN_SECRET;
const URL = process.env.FRONTEND_URL;

// user register 
const registerUser = catchAsync(async (req, res) => {
    let { firstname, lastname, username, email, password, role } = req.body;
    
    // Check if email is already used
    const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUserByEmail) {
        throw new ApiErrors(400, "Email already used!!");
    }

    // Check if username is already used
    const existingUserByUsername = await prisma.user.findUnique({
        where: { username },
    });
    if (existingUserByUsername) {
        throw new ApiErrors(400, "User Name already used!!");
    }

    // Hash the password
    let hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
        data: {
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            role,
        },
    });

    return res.status(200).json(new ApiResponse(200, { newUser }, "User registered Successfully"));
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
    let { userData, password } = req.body;

    // Find user by email or username
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: userData },
                { username: userData }
            ]
        }
    });

    if (!user) {
        throw new ApiErrors(404, "Email or username does not exist");
    }

    // Compare passwords
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiErrors(400, "Password is incorrect");
    }

    // Generate OTP
    const otp = generateOTP();
    console.log(otp);

    // Update user with OTP
    const updatedUser = await prisma.user.update({
        where: { email: user.email },
        data: { otp: otp }
    });

    // Send OTP to user's email
    sendOTP(user.email, otp, user.username);

    return res.status(200).json(new ApiResponse(200, updatedUser, "Verify OTP for Verification"));
});

//Verify OTP
const verifyOtp = catchAsync(async (req, res) => {
    const { userData, otp } = req.body;
    console.log({ userData, otp });

    // Find user by email or username and OTP
    const foundUser = await prisma.user.findFirst({
        where: {
            AND: [
                {
                    OR: [
                        { email: userData },
                        { username: userData }
                    ]
                },
                { otp: otp }
            ]
        }
    });

    if (foundUser) {
        // Create JWT token
        const token = jwt.sign({
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
        }, secretKey, { expiresIn: '30d' });

        return res.status(200).json(new ApiResponse(200, { token }, "Logged in Successfully"));
    } else {
        throw new ApiErrors(400, "OTP verification failed");
    }
});

// google and facebook login 
const socialLogin = catchAsync(async (req, res) => {
    let { firstname, lastname, username, email, password, role } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        // Compare passwords if user exists
        const isMatch = bcrypt.compare(password, existingUser.password);

        if (isMatch) {
            return res.status(200).json(new ApiResponse(200, existingUser, "User log in successfull"));
        } else {
            throw new ApiErrors(400, "Email already used!!");
        }
    } else {
        // Create new user if email doesn't exist
        const newUser = await prisma.user.create({
            data: {
                firstname,
                lastname,
                username,
                email,
                password: hashedPassword,
                role,
            },
        });
        return res.status(200).json(new ApiResponse(200, newUser, "User created successfully"));
    }
});

// send email for forget password
const forgetPassword = catchAsync(async (req, res) => {
    const {userData} = req.body;

    // Find user by email or username
    const foundUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: userData},
                { username: userData}
            ]
        }
    });

    if (!foundUser) {
        throw new ApiErrors(404, "User not found");
    }

    const id = foundUser.id;
    const name = `${foundUser.firstname} ${foundUser.lastname}`;
    const email = foundUser.email;

    const token = jwt.sign({ email: foundUser.email }, secretKey, { expiresIn: '1d' });
    const url = `${URL}/pages/User/forget_password/${id}/${token}`;

    // Send reset password email
     resetPassword(email, url, name);

    return res.status(200).json(new ApiResponse(200, null, "Password reset email sent successfully."));
});

// send email for forget password
const changePassword = catchAsync(async (req, res) => {
    const { id, token, password } = req.body;

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            throw new ApiErrors(400, "Invalid token");
        } else {
            let hashedPassword = await bcrypt.hash(password, 10);
            if (hashedPassword) {
                const updatedUser = await prisma.user.update({
                    where: { id: id },
                    data: { password: hashedPassword },
                });

                if (updatedUser) {
                    return res.status(200).json(new ApiResponse(200, null, 'Password updated successfully'));
                } else {
                    throw new ApiErrors(400, 'Password update failed');
                }
            } else {
                throw new ApiErrors(400, 'Password hashing failed');
            }
        }
    });
});

// get user by id
const user = catchAsync(async (req, res) => {
    const { id } = req.params;

    const foundUser = await prisma.user.findUnique({
        where: { id: id },
    });

    if (!foundUser) {
        throw new ApiErrors(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, foundUser, "Specific user is returned"));
});

// get all student information 
const students = catchAsync(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    try {
        const students = await prisma.user.findMany({
            where: { role: 'student' },
            take: limit,
            skip: offset,
        });

        if (students.length === 0) {
            throw new ApiErrors(404, "Students not found");
        }

        const totalStudents = await prisma.user.count({
            where: { role: 'student' }
        });

        const data = {
            students,
            currentPage: page,
            totalPages: Math.ceil(totalStudents / limit),
        };

        return res.status(200).json(new ApiResponse(200, data, "Students retrieved successfully"));
    } catch (error) {
        console.error("Error retrieving students:", error.message);
        throw new ApiErrors(500, "Error retrieving students");
    }
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