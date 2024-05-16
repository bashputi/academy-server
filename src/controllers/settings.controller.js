import pool from "../db/db.js";
import bcrypt from "bcrypt";


// update profile 
const profile = async(req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// update coverimage or profile image 
const image = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//delete cover photo
const coverimage = async(req, res) => {
    try {
        const { id } = req.params;
    const deleteQuery = 'UPDATE student SET coverimage = NULL WHERE id = $1';
    await pool.query(deleteQuery, [id]);
    res.status(200).json({ message: 'Cover photo deleted successfully.' });
    } catch (error) {
        res.status(400).json({ error: 'Internal server error' });
    }
};

//delete profile photo
const profileimage = async(req, res) => {
    try {
        const { id } = req.params;
    const deleteQuery = 'UPDATE student SET profileimage = NULL WHERE id = $1';
    await pool.query(deleteQuery, [id]);
    res.status(200).json({ message: 'Profile photo deleted successfully.' });
    } catch (error) {
        res.status(400).json({ error: 'Internal server error' });
    }
};

// reset password 
const resetPassword = async(req, res) => {
    try {
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
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// add social profile link 
const socialProfile = async(req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
















export {
    profile,
    image,
    coverimage,
    profileimage,
    resetPassword,
    socialProfile,
};