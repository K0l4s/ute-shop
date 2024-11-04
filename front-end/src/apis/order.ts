import axios from "axios";
import { BASE_URL } from "./base";

export const getOrderByUser = async (status:string, limit: number, offset: number) => {
  try {
    const response = await axios.get(
      BASE_URL + '/order/all', {
        params: {status, limit, offset },
        withCredentials: true
      }
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    throw err;
  }
};
export const placeOrder = async (orderData: any) => {
  try {
    const response = await axios.post(BASE_URL + '/order/place', orderData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const checkOutByVNPay = async (orderData: any) => {
  try {
    const response = await axios.post(BASE_URL + '/payment/create_payment_url', orderData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error checking out:', error);
    throw error;
  }
}

export const getDataReturnVNPay = async (queryParams: any) => {
  try {
    const response = await axios.get(BASE_URL + '/payment/vnpay_ipn', {
      params: queryParams,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error checking out:', error);
    throw error;
  }
}

export const getAllOrder = async () => {
  try {
    const response = await axios.get(BASE_URL + '/order', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error checking out:', error);
    throw error;
  }
}

export const getOrder = async (orderId: string) => {
  try {
    const response = await axios.get(BASE_URL + '/order/get/' + orderId, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error checking out:', error);
    throw error;
  }
}

export const updateCartStatus = async (orderId: string, status: string) => {
  try {
    // Kiểm tra đầu vào
    if (!orderId) {
      throw new Error("Order ID is required");
    }
    if (!status) {
      throw new Error("Status is required");
    }

    console.log("Sending request with:", { orderId, status }); // Log kiểm tra

    const response = await axios.put(
      `${BASE_URL}/order/status/${orderId}`, // URL với orderId trong params
      { status }, // Body gửi lên với status
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error checking out:', error.response.data); // Log chi tiết lỗi từ máy chủ
    } else {
      console.error('Error checking out:', error);
    }
    throw error;
  }
};


export const updateMultipleCartStatus = async (orderIds: number[]) => {
  try {
    // Kiểm tra đầu vào
    if (!orderIds || orderIds.length === 0) {
      throw new Error("Order IDs are required");
    }

    console.log("Sending request with:", { ordersId: orderIds }); // Log kiểm tra

    const response = await axios.post(
      `${BASE_URL}/order/multi/status`,
      { ordersId: orderIds }, // Đảm bảo payload phù hợp với cấu trúc mong đợi ở backend
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error updating cart status:', error.response.data); // Log chi tiết lỗi từ máy chủ
    } else {
      console.error('Error updating cart status:', error);
    }
    throw error;
  }
}
