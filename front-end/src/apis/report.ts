import axios from 'axios';
import { BASE_URL } from "./base";
export const getReportAPI = async (year:number) => {
    try {
        const response = await axios.get(
          BASE_URL + '/analyst/dashboard', 
          // save year to request body
          {params:{year} , withCredentials: true }
          
        );
        return response.data;
      } catch (err) {
        console.error('Error fetching user profile:', err);
        throw err;
      }
};
