import { ApiResponse } from "../utils/apiResponse.js";
import { ApiErrors } from "../utils//apiError.js";
import prisma from "../db/db.config.js";
import catchAsync from '../utils/catchAsync.js';


// create wishlist for user
const addWish = catchAsync(async (req, res) => {
    const { userId, courseId } = req.body;

      const wishlistItem = await prisma.wishlist.create({
        data: {
          userId: userId,
          courseId: courseId,
        }
      });

      if (!wishlistItem) {
        throw new ApiErrors(500, 'Failed to add to wishlist');
      }
      return res.status(200).json(new ApiResponse(200, wishlistItem, 'Added to wishlist successfully'));
  });

//get wishlist by user id
const specificWishlist = catchAsync(async (req, res) => {
    const { userId } = req.params;
  
      const wishlistItems = await prisma.wishlist.findMany({
        where: {
          userId: userId,
        },
        include: {
          course: true, 
        },
      });
  
      if (wishlistItems.length === 0) {
        throw new ApiErrors(404, 'No wishlist items found for this user');
      }
      const transformedData = wishlistItems.map(item => ({
        id: item.id,
        userId: item.userId,
        createdAt: item.createdAt,
        courseId: item.course.id, 
        authorId: item.course.authorId,  
        title: item.course.title,  
        thumbnail: item.course.thumbnail,
        category: item.course.category,
        date: item.course.date  
      }));
      
      return res.status(200).json(new ApiResponse(200, transformedData, 'Wishlist items retrieved successfully'));
    } 
  );


export {
    addWish,
    specificWishlist,

};