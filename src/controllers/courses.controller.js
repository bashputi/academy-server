import prisma from "../db/db.config.js";
import catchAsync from '../utils/catchAsync.js';
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


// create course 
const course = catchAsync(async (req, res) => {
  try {
    const {
        title,
        about,
        authorId,
        maxStudent,
        difficultyLevel,
        publicCourse,
        QNA,
        category,
        price,
        thumbnail,
        introVideo,
        courseBuilder, // This should be an array of dynamic objects
        instructors,
        attachments,
        additionalData,
        coursePrerequisites,
        certificateTemplate
    } = req.body;

  
    const prepareCourseBuilderData = (courseBuilder) => {
      if (!Array.isArray(courseBuilder)) {
        throw new Error('courseBuilder must be an array');
      }

      return courseBuilder.map(builder => {
        const { topicName, topicSummery, lessons = [], quizzes = [], assignment = null } = builder;

        return {
          topicName,
          topicSummery,
          lessons: {
            create: lessons.map(lesson => ({
              lessonName: lesson.lessonName,
              lessonContent: lesson.lessonContent,
              lessonImage: lesson.lessonImage,
              lessonVideo: lesson.lessonVideo,
              videoTime: lesson.videoTime,
              lessonAttachments: {
                create: lesson.lessonAttachments
              }
            }))
          },
          quizzes: {
            create: quizzes.map(quiz => ({
              quizName: quiz.quizName,
              quizSummery: quiz.quizSummery,
              quizQuestions: {
                create: quiz.quizQuestions.map(question => ({
                  question: question.question,
                  questionType: question.questionType,
                  answerRequired: question.answerRequired,
                  point: question.point,
                  description: question.description,
                  answer: question.answer
                }))
              },
              quizSettings: {
                create: { ...quiz.quizSettings }
              }
            }))
          },
          assignment: assignment ? {
            create: {
              title: assignment.title,
              summary: assignment.summary,
              attachments: assignment.attachments,
              timeLimit: assignment.timeLimit,
              totalPoint: assignment.totalPoint,
              minimumPassPoint: assignment.minimumPassPoint,
              allowUpload: assignment.allowUpload,
              maximumFileSize: assignment.maximumFileSize
            }
          } : null
        };
      });
    };

    const course = await prisma.course.create({
      data: {
        title,
        about,
        authorId,
        maxStudent,
        difficultyLevel,
        publicCourse,
        QNA,
        category,
        price: {
          create: {
            type: price.type,
            regular: price.regular,
            discounted: price.discounted
          }
        },
        thumbnail,
        introVideo,
        courseBuilder: {
          create: prepareCourseBuilderData(courseBuilder)
        },
        instructors: {
          create: instructors.map(instructor => ({
            name: instructor.name,
            email: instructor.email
          }))
        },
        attachments: {
          createMany: {
            data: attachments
          }
        },
        additionalData: {
          createMany: {
            data: [additionalData]
          }
        },
        coursePrerequisites,
        certificateTemplate
      }
    });

    return res.status(200).json(new ApiResponse(200, course, 'Course created successfully'));
} catch (error) {
    console.error("Error creating course:", error);
     res.status(500).json({ success: false, message: "Failed to create course", error: error.message });
}
});

//  get all courses  
const allCourses = catchAsync(async (req, res) => {
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
      return res.status(200).json(new ApiResponse(200, data, 'Courses retrieved successfully'));
    } catch (error) {
      throw new ApiErrors(404, 'Error retrieving courses');
    }
});

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
        include: {
          course: true, 
        },
      });
    } else if (id) {
      // Fetch courses by courseId (id)
      courses = await prisma.course.findMany({
        where: {
          id: id,
        },
    include: {
    price: true,
    courseBuilder: {
      include: {
        lessons: {
          include: {
            lessonAttachments: true
          }
        },
        quizzes: {
          include: {
            quizQuestions: true,
            quizSettings: true
          },
              },
        assignment: true,
      }
    },
    additionalData: true,
    instructors: true,
    attachments: true,
    }});
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