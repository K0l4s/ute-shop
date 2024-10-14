const db = require("../models");
const Cart = db.Cart;
const Book = db.Book;
const { Op } = require("sequelize");

// Hàm thêm sản phẩm vào giỏ hàng
const addToCart = async (userId, bookId, quantity) => {
  try {
    // Kiểm tra nếu sách có tồn tại trong giỏ hàng
    const cartItem = await Cart.findOne({
      where: {
        user_id: userId,
        book_id: bookId
      }
    });

    if (cartItem) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      await Cart.create({
        user_id: userId,
        book_id: bookId,
        quantity
      });
    }

    return { message: "Sản phẩm đã được thêm vào giỏ hàng" };
  } catch (error) {
    throw error;
  }
};

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (userId, bookId, quantity) => {
  try {
    // Kiểm tra nếu sản phẩm có trong giỏ hàng
    const cartItem = await Cart.findOne({
      where: {
        user_id: userId,
        book_id: bookId
      }
    });

    if (!cartItem) {
      throw new Error("Sản phẩm không tồn tại trong giỏ hàng");
    }

    // Cập nhật số lượng sản phẩm
    cartItem.quantity = quantity;
    await cartItem.save();

    return { message: "Số lượng sản phẩm đã được cập nhật" };
  } catch (error) {
    throw error;
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (userId, bookId) => {
  try {
    // Tìm sản phẩm trong giỏ hàng
    const cartItem = await Cart.findOne({
      where: {
        user_id: userId,
        book_id: bookId
      }
    });

    if (!cartItem) {
      throw new Error("Sản phẩm không tồn tại trong giỏ hàng");
    }

    // Xóa sản phẩm khỏi giỏ hàng
    await cartItem.destroy();

    return { message: "Sản phẩm đã được xóa khỏi giỏ hàng" };
  } catch (error) {
    throw error;
  }
};

// Hàm lấy giỏ hàng của người dùng
const getUserCart = async (userId) => {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: {
        model: Book,
        as: 'book',
        attributes: ['id', 'title', 'price', 'cover_img_url'] // Chỉ lấy các thông tin cần thiết của sách
      }
    });

    // Định dạng lại dữ liệu giỏ hàng trước khi trả về
    const formattedCartItems = cartItems.map((item) => ({
      book: item.book,
      quantity: item.quantity
    }));

    return formattedCartItems;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addToCart,
  updateCartItem,
  removeFromCart,
  getUserCart
};
