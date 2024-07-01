import prisma from "../db/db.config.js";
import catchAsync from '../utils/catchAsync.js';
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


// create course 
const course = async (req, res) => {
    const { title, description, authorId, content } = req.body;

    try {
        const newCourse = await prisma.course.create({
            data: {
                title,
                description,
                content,
                authorId,
                createdAt: new Date(), 
                updatedAt: new Date() 
            }
        });

        return res.status(200).json(new ApiResponse(200, { newCourse }, "Course added successfully"));
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target.includes('title_unique')) {
            throw new ApiErrors(400, "Course title already exists");
        } else {
            throw new ApiErrors(500, "Failed to add course");
        }
    }
};

// need to work after create course
//  get all courses for admin 
const allCourses = async (req, res) => {
    const { status, category, date, search } = req.body;
    const sortBy = req.body.sortBy || 'createdAt'; // Default sortBy to createdAt or another valid field
    const sortOrder = req.body.sortOrder || 'asc';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
  
    try {
      // Prisma filtering and pagination
      const coursesQuery = {
       
        take: limit,  // Limit results per page
        skip: skip,   // Offset based on pagination
      };
  
      // Apply filters if provided
      if (status) {
        coursesQuery.where = {
          ...(coursesQuery.where || {}),
          status,
        };
      }
      if (category) {
        coursesQuery.where = {
          ...(coursesQuery.where || {}),
          category,
        };
      }
      if (date) {
        coursesQuery.where = {
          ...(coursesQuery.where || {}),
          createdAt: { equals: new Date(date) },
        };
      }
      if (search) {
        coursesQuery.where = {
          ...(coursesQuery.where || {}),
          OR: [
            { category: { contains: search } }, // Search by category
            { title: { contains: search } }    // Search by title
          ],
        };
      }
  
      // Query courses
      const courses = await prisma.course.findMany(coursesQuery);
  
      // Count total courses for pagination if not provided in filters
      const totalCourses = await prisma.course.count({
        where: coursesQuery.where,
      });
  
      const data = {
        totalCourses,
        courses,
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
      };
  
      // Respond with success
      return res.status(200).json({
        statusCode: 200,
        data,
        message: "Courses retrieved successfully",
        success: true,
      });
    } catch (error) {
      console.error("Error retrieving courses:", error.message);
      return res.status(500).json({
        message: "Error retrieving courses",
        error: error.message,
      });
    }
  };

// get all course for user


  
  // need to work after create course
// get specific courses by id for all
const specificCourses = catchAsync(async (req, res) => {
    const { id, authorId } = req.body;
  
    let courses;
  
    if (authorId) {
      // Fetch courses by authorId
      courses = await prisma.course.findMany({
        where: {
          authorId: authorId,
        },
        select: {
            title: true,
            description: true,
          },
      });
    } else if (id) {
      // Fetch courses by courseId (id)
      courses = await prisma.course.findMany({
        where: {
          id: id,
        },
      });
    } else {
     throw new ApiErrors(400, "Invalid request. Provide either authorId or id.");
      
    }
  
    if (courses.length > 0) {
        return res.status(200).json(new ApiResponse(200, courses, "Courses retrieved successfully"));
    } else {
   throw new ApiErrors(404, "No courses found"); 
    }
  });

// get specific courses by id for all
const coursesByCategory = catchAsync(async (req, res) => {
    const { category } = req.body;
  
    // Fetch courses from Prisma based on category
    const courses = await prisma.course.findMany({
      where: {
        category: category,
      },
      select: {
        id: true,
        Thumbnail: true, // Adjust if 'Thumbnail' is not a valid field in the Course model
        title: true,
        author: true,
        authorId: true,
      },
    });
  
    if (courses.length > 0) {
      return res.status(200).json(new ApiResponse(200, courses, "Courses retrieved successfully"));
    } else {
      throw new ApiErrors(404, "No courses found");
    }
  });

// delete courses 
const deleteCourses = catchAsync(async (req, res) => {
    const { id } = req.params;
  
    // Use Prisma to delete the course by ID
    const deletedCourse = await prisma.course.delete({
      where: {
        id: id,
      },
    });
  
    if (!deletedCourse) {
      throw new ApiErrors(404, 'No course found');
    }
  
    return res.status(200).json(new ApiResponse(200, {}, 'Course deleted successfully'));
  });

  // need to work after create course
// edit course by id
const editCourses = catchAsync(async (req, res) => {
    let { title, description, content } = req.body;
    const { id } = req.params;
  
      const updatedCourse = await prisma.course.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          description: description,
          content: content,
        }
      });
  
      if (!updatedCourse) {
        throw new ApiErrors(404, 'Course not found');
      }
      return res.status(200).json(new ApiResponse(200, updatedCourse, 'Course edited successfully.')); 
  });

// change publish status 
const statusCourses = catchAsync(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
  
      const updatedCourse = await prisma.course.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });
  
      if (!updatedCourse) {
        throw new ApiErrors(404, 'Course not found');
      }
      return res.status(200).json(new ApiResponse(200, updatedCourse, 'Course status updated successfully.'));
  });





export {
    course, 
    allCourses,
    specificCourses,
    coursesByCategory,
    deleteCourses,
    editCourses,
    statusCourses,

};