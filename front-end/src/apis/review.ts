import axios from "axios";
import { BASE_URL } from "./base";

// Function to login
export const createReview = async (bookId:number, content:string, star: number) => {
  try {
    const response = await axios.post(
      BASE_URL + `/review`,
      { 
        bookId,
        content,
        star
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