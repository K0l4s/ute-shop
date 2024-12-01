const db = require("../models");
const Review = db.Review;
const Order = db.Order;
const User = db.User;
const Wallet = db.Wallet;

const createReview = async ({ userId, bookId, content, star }) => {
  try {
    const review = {
      user_id: userId,
      book_id: bookId,
      content: content,
      star: star,
    };

    const newReview = await Review.create(review);

    const responseReview = await Review.findOne({
      where: {
        id: newReview.id,
      },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName"],
        },
      ],
    });
    return responseReview;
  } catch (error) {
    throw error;
  }
};

const submitAllReviews = async ({ userId, reviews, orderId }) => {
  const transaction = await db.sequelize.transaction();
  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
        user_id: userId,
        status: "SHIPPED",
        isReviewed: false,
      },
    });
    if (!order) {
      throw new Error("Bạn chỉ có thể đánh giá đơn hàng đã nhận thành công!");
    }

    for (const review of reviews) {
      await Review.create(
        {
          user_id: userId,
          book_id: review.bookId,
          content: review.content,
          star: review.star,
        },
        { transaction }
      );
    }

    // 20.000 đ = + 1 coin
    const totalValue = parseFloat(order.total_price);
    const coinsToAdd = Math.floor(totalValue / 20000);

    // Add coins to the user's wallet
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    wallet.coins += coinsToAdd;
    
    await wallet.save({ transaction });
    await order.update({ isReviewed: true }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getBookReviews = async ({ bookId, stars }) => {
  try {
    const whereClause = {
      book_id: bookId
    };

    if (stars) {
      whereClause.star = stars;
    }

    const reviews = await Review.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName"],
        },
      ],
      order: [['id', 'DESC']]
    });

    return reviews;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createReview,
  submitAllReviews,
  getBookReviews
};
