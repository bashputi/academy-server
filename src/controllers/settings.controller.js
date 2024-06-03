import pool from "../db/db.js";
import bcrypt from "bcrypt";
import catchAsync from '../utils/catchAsync.js';

// update profile 
const profile = catchAsync(async(req, res) => {
        let { firstname, lastname, username, skill, phone, bio } = req.body;
        const { id } = req.params;

    const updateQuery = {
        text: `UPDATE student 
               SET firstname = $1,
                lastname = $2,
                username = $3,
                phone = $4,  
                skill = $5,
                bio = $6
               WHERE id = $7
               RETURNING *`,
        values: [firstname, lastname, username, phone, skill, bio, id],
    };
    const result = await pool.query(updateQuery);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
});

// update coverimage or profile image 
const image = catchAsync(async (req, res) => {
        const { profileimage, coverimage } = req.body;
        const { id } = req.params;

    const updateQuery = {
        text: `UPDATE student 
               SET profileimage = $1,
               coverimage = $2
                WHERE id = $3
                RETURNING *`,
        values: [profileimage, coverimage, id],
    };
    const result = await pool.query(updateQuery);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
});

//delete cover photo by id
const coverimage = catchAsync(async(req, res) => {
        const { id } = req.params;
    const deleteQuery = 'UPDATE student SET coverimage = NULL WHERE id = $1';
    await pool.query(deleteQuery, [id]);
    res.status(200).json({ message: 'Cover photo deleted successfully.' });
});

//delete profile photo by id
const profileimage = catchAsync(async(req, res) => {
    const { id } = req.params;
const deleteQuery = 'UPDATE student SET profileimage = NULL WHERE id = $1';
await pool.query(deleteQuery, [id]);
res.status(200).json({ message: 'Profile photo deleted successfully.' });
});

// reset password 
const resetPassword = catchAsync(async(req, res) => {
        const { password, newpassword } = req.body;
        const { id } = req.params;
        const results = await pool.query(`SELECT * FROM student WHERE id = $1`, [id]);
        const user = results.rows[0];
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(201).json({ message: 'Current password is incorrect' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        await pool.query(`UPDATE student SET password = $1 WHERE id = $2`, [hashedPassword, id]);
        res.status(200).json({ message: 'Password updated successfully' });
});

// add social profile link 
const socialProfile = catchAsync(async(req, res) => {
        let { facebook, twitter, linkedin, website, github } = req.body;
        const { id } = req.params;

    const updateQuery = {
        text: `UPDATE student 
               SET facebook = $1,
                twitter = $2,
                linkedin = $3,
                github = $4,  
                website = $5
               WHERE id = $6
               RETURNING *`,
        values: [facebook, twitter, linkedin, github, website, id],
    };
    const result = await pool.query(updateQuery);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
});









export {
    profile,
    image,
    coverimage,
    profileimage,
    resetPassword,
    socialProfile,
};