import axios from "axios";
import { BASE_URL } from "./base";

// Function to login
export const createReview = async (bookId:number, content:string, star: number, orderId: number) => {
  try {
    const response = await axios.post(
      BASE_URL + `/review/add`,
      { 
        bookId,
        content,
        star,
        orderId
      },
      { headers: 
        { 'Content-Type': 'application/json' }, 
        withCredentials: true 
      }
    );
    
    return response.data;
  } catch (err) {
    console.error('Có lỗi xảy ra: ', err);
    throw err;
  }
};

export const submitAllReviews = async ({ userId, reviews, orderId }: { userId: number, reviews: { bookId: number, content: string, star: number }[], orderId: number }) => {
  try {
    const response = await axios.post(
      BASE_URL + `/review/add/multiple`,
      { userId, reviews, orderId },
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error('Có lỗi xảy ra: ', err);
    throw err;
  }
};

export const getReviewsByStars = async (bookId: number, stars?: number) => {
  try {
    const response = await axios.get(
      BASE_URL + `/review/book/${bookId}`,
      {
        params: { stars },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
    return response.data;
  } catch (err) {
    console.error('Có lỗi xảy ra: ', err);
    throw err;
  }
};