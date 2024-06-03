import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';



// add to blog 
const addBlog= async(req, res) => {
 try {
    const { author_name, Title, category, image, description, tags} = req.body;
    const id = uuidv4();
    console.log({ id, author_name, Title, category, image, description, tags });
    
    pool.query('INSERT INTO blog (id, author_name, Title, category, image, description, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [id, author_name, Title, category, image, description, tags],
    (error, result) => {
        if (error) {
            return res.status(201).json({ message: 'Failed to add blog' });
        } else {
            return res.status(200).json({ message: 'Blog added successfully', course: result.rows[0] });
        }
    });
 } catch (error) {
    res.status(400).json({ error: error.message });
 }
};

// get all categories
const allBlog = async(req, res) => {
    try {
        const users = await pool.query("SELECT * FROM blog;")
        res.status(200).json({message: "Blogs are returned", data: users.rows});
    } catch (error) {
        return res.status(400).json({ message: 'Internal server error' });
    }
};

//get blog for specific one
const specificBlog = async(req, res) => {
    try {
        const { id } = req.params;
        const users = await pool.query('SELECT * FROM blog WHERE authorid = $1', [id]);
        if(users.rows.length > 0){
            res.status(200).json({message: "blog is returned.", data: users.rows[0] });
        }else{
            res.status(201).json({message: "No blog found" });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Internal server error' });  
    }
};


export {
  
    addBlog,
    specificBlog,
    allBlog

};