import pool from "../db/db.js";



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


















export {
    profile,

};