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
