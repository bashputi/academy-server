import prisma from "../db/db.config.js";
import catchAsync from '../utils/catchAsync.js';
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";



// enroll courses for student
const enrollCourses = catchAsync(async (req, res) => {
    const { studentId, courseId } = req.body;
  
    // Check if the course exists
    const existingCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
  
    if (!existingCourse) {
      throw new ApiErrors(404, 'Course not found');
    }
  
    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: courseId,
        studentId: studentId,
        enrollmentDate: new Date(),
        enrollmentStatus: 'pending',
      },
      include: {
        student: true, 
      },
    });
 
    if (enrollment?.data?.student?.role !== 'student') {
         await prisma.user.update({
          where: {
            id: studentId,
          },
          data: {
            role: 'student',
          },
        });
    }
  
    return res.status(200).json(new ApiResponse(200, enrollment, 'Enrollment successful'));
  });

// get all enroll for admin
const getEnroll = catchAsync(async (req, res) => {
  const { date, course, status, search } = req.body;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const whereConditions = {
      // Apply filters if provided
      ...(date && {
        enrollmentDate: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lt: new Date(`${date}T23:59:59.999Z`)
        }
      }),
      ...(course && {
        course: {
          title: { contains: course, mode: 'insensitive' }
        }
      }),
      ...(status && { enrollmentStatus: status }),
      OR: [
        { student: { firstname: { contains: search, mode: 'insensitive' } } }, // Search by student name
        { student: { lastname: { contains: search, mode: 'insensitive' } } },
        { student: { email: { contains: search, mode: 'insensitive' } } },
        { course: { title: { contains: search, mode: 'insensitive' } } }     // Search by course title
      ],
    };

    // Prisma filtering, sorting, and pagination
    const enrollments = await prisma.enrollment.findMany({
      where: whereConditions,
      take: limit,
      skip: skip,
      include: {
        student: true, // Include student information
        course: true,  // Include course information
      }
    });

    // Count total enrollments for pagination
    const totalEnrollments = await prisma.enrollment.count({
      where: whereConditions,
    });

    if (enrollments.length === 0 && totalEnrollments === 0) {
      throw new ApiErrors(404, 'No enrollments found');
    }

    const data = {
      totalEnrollments,
      enrollments: enrollments.map(enrollment => ({
        id: enrollment.id,
        date: enrollment.enrollmentDate,
        course: enrollment.course.title,
        name: `${enrollment.student.firstname} ${enrollment.student.lastname}`,
        email: enrollment.student.email,
        status: enrollment.enrollmentStatus,
      })),
      currentPage: page,
      totalPages: Math.ceil(totalEnrollments / limit),
    };

    // Respond with the formatted enrollment data
    return res.status(200).json(new ApiResponse(200, data, 'Enrollments retrieved successfully'));
  } catch (error) {
    console.error('Error retrieving enrollments:', error.message);
    throw new ApiErrors(500, `An internal server error occurred: ${error.message}`);
  }
});


// need to change after course create
//get specific emrollment
const specificEnrollment = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Fetch specific enrollment using Prisma
  const enrollment = await prisma.enrollment.findMany({
    where: {
      studentId: id,
    },
    include: {
      course: true, 
    },
  });

  // Check if enrollment exists
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  // Respond with the formatted enrollment data
  return res.status(200).json({
    message: 'Specific enrollment returned',
   enrollment
  });
});


export {
    enrollCourses,
    getEnroll,
    specificEnrollment,

};