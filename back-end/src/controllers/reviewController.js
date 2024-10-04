const { Op } = require("sequelize");
const { createReview } = require('../services/reviewService');
const createReviewController = async (req,res) => {
    try {
        const userId = req.user.id;
        const {bookId,content,star} = req.body;

        const newReview = await createReview({userId,bookId,content,star});
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
module.exports = {
    createReviewController
}