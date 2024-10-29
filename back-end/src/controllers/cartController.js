const { addToCart, updateCartItem, removeFromCart, getUserCart, increaseQuantity, decreaseQuantity, validateCart, toggleChecked, toggleCheckAll } = require("../services/cartService.js");

// Controller thêm sản phẩm vào giỏ hàng
const addToCartController = async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user.id; // Thêm điều kiện check login hay chưa?
  
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

// Controller tăng sản phẩm trong giỏ hàng
const increaseQuantityController = async (req, res) => {
  const { bookId} = req.body;
  const userId = req.user.id; 
  
  try {
    const result = await increaseQuantity(userId, bookId);
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Controller giảm sản phẩm trong giỏ hàng
const decreaseQuantityController = async (req, res) => {
  const { bookId} = req.body;
  const userId = req.user.id; 
  
  try {
    const result = await decreaseQuantity(userId, bookId);
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const toggleCheckedController = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;
  
  try {
    const result = await toggleChecked(userId, bookId);
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  };
}

const toggleCheckAllController = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const result = await toggleCheckAll(userId);
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  };
};

const validateCartController = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userId = req.user.id;
    const result = await validateCart(userId, cartItems);
    if (result.valid) {
      return res.status(200).json({ message: "valid" });
    } else {
      return res.status(400).json({ message: "Cart validation failed", errors: result.errors });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  };
}

module.exports = {
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  getUserCartController,
  increaseQuantityController,
  decreaseQuantityController,
  toggleCheckedController,
  toggleCheckAllController,
  validateCartController
};
