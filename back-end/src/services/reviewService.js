const db = require("../models");
const Review = db.Review;
const { Op } = require("sequelize");

const createReview = async ({userId, bookId, content, star}) => {
    try {
        const review = {
            user_id: userId,
            book_id: bookId,
            content: content,
            star: star,
        };
        const newReview = await Review.create(review);
        return newReview;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    createReview

}