const db = require("../models");
const Review = db.Review;
const Order = db.Order;
const User = db.User;
const { Op } = require("sequelize");

const createReview = async ({userId, bookId, content, star}) => {
    try {
        const review = {
            user_id: userId,
            book_id: bookId,
            content: content,
            star: star,
        };
        // const reviewExist = await Review.findOne({
        //     where: {
        //         user_id: userId,
        //         book_id: bookId,
        //     },
        // });
        // if (reviewExist) {
        //     throw new Error("You're already reviewed this book");
        // }
        // // Kiểm tra xem người dùng đã mua sách này chưa
        // const isPurchased = await Order.findOne({
        //     where: {
        //         user_id: userId,
        //         book_id: bookId,
        //         status: "success",
        //     },
        // });
        const newReview = await Review.create(review);
        const responseReview = await Review.findOne({
            where: {
                id: newReview.id,
               
            },
            include: [
                {
                  model: User,
                  attributes: ['firstName', 'lastName']
                }
              ]
        });
        return responseReview;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    createReview

}