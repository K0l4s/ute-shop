const { addToCart, updateCartItem, removeFromCart, getUserCart } = require("../services/cartService.js");

// Controller thêm sản phẩm vào giỏ hàng
const addToCartController = async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user.id; // Giả sử user đã được xác thực và lưu thông tin trong `req.user`
  
  try {
    const result = await addToCart(userId, bookId, quantity);
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Controller cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItemController = async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user.id;
  
  try {
    const result = await updateCartItem(userId, bookId, quantity);
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Controller xóa sản phẩm khỏi giỏ hàng
const removeFromCartController = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    const result = await removeFromCart(userId, bookId);
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Controller lấy giỏ hàng của người dùng
const getUserCartController = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await getUserCart(userId);
    return res.status(200).json({
      message: "success",
      data: cartItems
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  getUserCartController
};
