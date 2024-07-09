import prisma from "../db/db.config.js";
import catchAsync from '../utils/catchAsync.js';
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


// create wishlist 
const addCategory = catchAsync(async (req, res) => {
    const { authorId, name, description, thumbnail } = req.body;
      const newCategory = await prisma.category.create({
        data: {
          id,
          authorId,
          name,
          description,
          thumbnail, 
          count: 0, 
        },
      });
      return res.status(200).json(new ApiResponse(200, { category: newCategory }, "Category added successfully"));
  });

// get all categories
const allCategories = catchAsync(async (req, res) => {
    const page = Number(req.query.page) || 1; 
    const limit = Number(req.query.limit) || 12; 
   
        // Query to get total count of categories
        const totalCategories = await prisma.category.count();

        // Query to get categories with pagination
        const categories = await prisma.category.findMany({
            skip: offset,
            take: limit,
        });

        if (categories.length === 0) {
            throw new ApiErrors(404, "Categories not found");
        }

        const data = {
            totalCategories,
            categories,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / limit),
        };

        return res.status(200).json(new ApiResponse(200, data, "Categories retrieved successfully"));
});

// get specific courses by id
const specificCategories = catchAsync(async (req, res) => {
    const { id } = req.params;
        const categories = await prisma.category.findMany({
            where: {
                authorId: id,
            },
        });
        if (categories.length > 0) {
            return res.status(200).json(new ApiResponse(200, categories, "Specific categories are returned"));
        } else {
            return res.status(404).json(new ApiErrors(404, "No categories available"));
        }

});


// edit categories
const editCategories = catchAsync(async (req, res) => {
    const { authorId, icone, Title } = req.body;
    const { id } = req.params;

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                authorId,
                name: Title,
                description: icone,
            },
        });

        if (!updatedCategory) {
            return res.status(404).json(new ApiErrors(404, "Category not found"));
        }

        return res.status(200).json(new ApiResponse(200, updatedCategory, "Category edited successfully"));
});

// delete categories
const deleteCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
        const deletedCategory = await prisma.category.delete({
            where: { id: id },
        });
        return res.status(200).json(new ApiResponse(200, deletedCategory, "Category deleted successfully")); 
});



export {
    addCategory,
    allCategories,
    specificCategories,
    editCategories,
    deleteCategory,


};