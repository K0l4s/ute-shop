const { Op } = require("sequelize");
const { createReview, submitAllReviews } = require('../services/reviewService');
const createReviewController = async (req,res) => {
    try {
        const userId = req.user.id;
        const {bookId,content,star,orderId} = req.body;

        const newReview = await createReview({userId,bookId,content,star,orderId});
        if (!newReview) {
            return res.status(404).json({ message: "Not found" });
        }
        return res.status(200).json({
            message: "success",
            data: newReview
        });
    } catch (error) {
        throw error;
    }
}

const createReviewsMultipleItemsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reviews, orderId } = req.body;
        const newReviews = await submitAllReviews({ userId, reviews, orderId });
        return res.status(200).json({
            message: "success",
            data: newReviews
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createReviewController,
    createReviewsMultipleItemsController
}