import prisma from "../db/db.config.js";
import catchAsync from '../utils/catchAsync.js';
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


// add to announcement
const addAnnouncement = catchAsync(async (req, res) => {
    const { course, summary, title, authorId } = req.body;
    
    if (!course || !summary || !title || !authorId) {
        return res.status(400).json(new ApiErrors(400, "All fields are required"));
    }

    try {
        const newAnnouncement = await prisma.announcement.create({
            data: {
                course,
                summary,
                title,
                authorId,
                site_notification: false 
            }
        });

        return res.status(200).json(new ApiResponse(200, newAnnouncement, "Announcement added successfully"));
    } catch (error) {
        return res.status(500).json(new ApiErrors(500, "An error occurred while adding the announcement"));
    }
});

//get announcement by course name
const announc = catchAsync(async (req, res) => {
    const { course_name } = req.params;

    if (!course_name) {
        return res.status(400).json(new ApiErrors(400, "Course name is required"));
    }
        const announcements = await prisma.announcement.findMany({
            where: {
                course: course_name
            }
        });

        if (announcements.length > 0) {
            return res.status(200).json(new ApiResponse(200, announcements, "These are your announcements."));
        } else {
            return res.status(404).json(new ApiErrors(404, "No announcement found"));
        }
});

//get announcement by id
const specificAnnouncement = catchAsync(async (req, res) => {
    const { id } = req.params;
        const announcement = await prisma.announcement.findUnique({
            where: {
                id: id
            }
        });

        if (announcement) {
            return res.status(200).json(new ApiResponse(200, announcement, "Specific announcement is returned"));
        } else {
            return res.status(404).json(new ApiErrors(404, "No announcement found with the given ID"));
        }
});


export {
    addAnnouncement,
    announc,
    specificAnnouncement,

};