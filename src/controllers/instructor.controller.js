import prisma from "../db/db.config.js";
import nodemailer from 'nodemailer';
import catchAsync from '../utils/catchAsync.js';
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// appication as instructor for user
const application = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
        });

        if (!updatedUser) {
            throw new ApiErrors(404, "Update failed");
        }

        return res.status(200).json(new ApiResponse(200, null, "Role updated successfully"));
    } catch (error) {
        console.error("Error updating role:", error.message);
        throw new ApiErrors(500, "Error updating role");
    }
});

//get the instructors and the applicators for admin
const instructor = catchAsync(async (req, res) => {
    const { status, category, date, search } = req.body;
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder || 'asc';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

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
        // Base query to fetch users based on roles
        const query = {
            where: {
                role: {
                    in: roles,
                },
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
            take: limit,
            skip,
        };

        // Add additional filters
        if (category) {
            query.where.category = category;
        }
        if (date) {
            query.where.date = {
                equals: date,
            };
        }
        if (search) {
            query.where.OR = [
                {
                    firstname: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    role: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ];
        }

        // Fetch users and count
        const [instructors, totalInstructors] = await Promise.all([
            prisma.user.findMany(query),
            prisma.user.count({
                where: query.where,
            }),
        ]);

        if (instructors.length === 0 && totalInstructors === 0) {
            throw new ApiErrors(404, "Instructors not found");
        }

        const data = {
            totalInstructors,
            instructors,
            currentPage: page,
            totalPages: Math.ceil(totalInstructors / limit),
        };

        return res.status(200).json(new ApiResponse(200, data, "Instructors retrieved successfully"));
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving instructors", error: error.message });
    }
});

// accept or declined instructor request for admin
const instructorRequest = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                role,
            },
        });

        if (!updatedUser) {
            throw new ApiErrors(404, 'User not found');
        }
       return res.status(200).json(new ApiResponse(200, "Status updated successfully"));
    } catch (error) {
        throw new ApiErrors(404, 'Internal server error');
    }
});





export {
    application,
    instructor,
    instructorRequest,

};