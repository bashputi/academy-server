import prisma from "../db/db.config.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiErrors } from "../utils//apiError.js"; 
import catchAsync from '../utils/catchAsync.js';


// update profile for all user 
const profile = catchAsync(async (req, res) => {
    let { firstname, lastname, username, skill, phone, bio } = req.body;
    const { id } = req.params;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {
                firstname,
                lastname,
                username,
                phone,
                skill,
                bio,
            },
        });

        if (!updatedUser) {
            throw new ApiErrors(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
    } catch (error) {
        console.error("Error updating profile:", error.message);
        throw new ApiErrors(500, "Error updating profile");
    }
});

// update coverimage or profile image for all user 
const image = catchAsync(async (req, res) => {
    const { profileimage, coverimage } = req.body;
    const { id } = req.params;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {
                profileimage,
                coverimage,
            },
        });

        if (!updatedUser) {
            throw new ApiErrors(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, updatedUser, "Images updated successfully"));
    } catch (error) {
        throw new ApiErrors(500, "Error updating images");
    }
});

//delete cover photo by id for all user 
const coverimage = catchAsync(async (req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: { coverimage: null },
        });

        if (!updatedUser) {
            throw new ApiErrors(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, null, "Cover photo deleted successfully."));
    } catch (error) {
        console.error("Error deleting cover photo:", error.message);
        throw new ApiErrors(500, "Error deleting cover photo");
    }
});

//delete profile photo by id for all user 
const profileimage = catchAsync(async (req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: { profileimage: null },
        });

        if (!updatedUser) {
            throw new ApiErrors(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, null, "Profile photo deleted successfully."));
    } catch (error) {
        throw new ApiErrors(500, "Error deleting profile photo");
    }
});

// reset password for all user 
const resetPassword = catchAsync(async (req, res) => {
    const { password, newpassword } = req.body;
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new ApiErrors(404, "User not found");
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiErrors(400, "Current password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });

        return res.status(200).json(new ApiResponse(200, null, "Password updated successfully"));
    } catch (error) {
        throw new ApiErrors(500, "Error updating password");
    }
});

// add social profile link for all user 
const socialProfile = catchAsync(async (req, res) => {
    const { facebook, twitter, linkedin, website, github } = req.body;
    const { id } = req.params;

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                facebook,
                twitter,
                linkedin,
                github,
                website,
            },
        });

        if (!updatedUser) {
            throw new ApiErrors(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, updatedUser, "Social profiles updated successfully"));
    } catch (error) {
        throw new ApiErrors(500, "Error updating social profiles");
    }
});




export {
    profile,
    image,
    coverimage,
    profileimage,
    resetPassword,
    socialProfile,
};