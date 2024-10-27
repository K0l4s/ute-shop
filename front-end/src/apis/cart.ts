import axios from "axios";
import { BASE_URL } from "./base";

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (bookId: number, quantity: number) => {
  try {
    const response = await axios.post(BASE_URL + "/cart/add", {
      bookId,
      quantity
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (bookId: number, quantity: number) => {
  try {
    const response = await axios.put(BASE_URL + "/cart/update", {
      bookId,
      quantity
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (bookId: number) => {
  try {
    const response = await axios.post(BASE_URL + "/cart/remove", {
      bookId
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

// Lấy giỏ hàng của người dùng
export const getUserCart = async () => {
  try {
    const response = await axios.get(BASE_URL + "/cart/all", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching user cart:", error);
    throw error;
  }
};

// Tăng số lượng sản phẩm trong giỏ hàng
export const increaseQuantity = async (bookId: number) => {
  try {
    const response = await axios.post(BASE_URL + "/cart/inc", {
      bookId
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error increasing quantity:", error);
    throw error;
  }
};

// Giảm số lượng sản phẩm trong giỏ hàng
export const decreaseQuantity = async (bookId: number) => {
  try {
    const response = await axios.post(BASE_URL + "/cart/dec", {
      bookId
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    throw error;
  }
};
