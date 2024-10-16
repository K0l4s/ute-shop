import axios from 'axios';
import { BASE_URL } from './base';

export const placeOrder = async (orderData: any) => {
  try {
    const response = await axios.post(BASE_URL + '/order/place', orderData, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const checkOutByVNPay = async (orderData: any) => {
  try {
    const response = await axios.post(BASE_URL + '/payment/create_payment_url', orderData, {withCredentials: true});
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


export const getOrder = async (orderId: string) => {
  try {
    const response = await axios.get(BASE_URL + '/order/get/' + orderId, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Error checking out:', error);
    throw error;
  }
} 