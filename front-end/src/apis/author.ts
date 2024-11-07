import axios from "axios";
import { BASE_URL } from "./base";

export const getAllAuthors = async () => {
    try {
        const response = await axios.get(
          BASE_URL + `/author`,
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

export const createAuthor = async (author: any) => {
    try {
        const response = await axios.post(
          BASE_URL + `/author`,
          author,
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
}

export const updateAuthor = async (author: any) => {
    try {
        const response = await axios.put(
          BASE_URL + `/author/${author.id}`,
          author,
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
}