import axios from 'axios';
import { BASE_URL } from "./base";
export const getReportAPI = async () => {
    try {
        const response = await axios.get(
          BASE_URL + '/analyst/dashboard', 
          { withCredentials: true }
        );
        return response.data;
      } catch (err) {
        console.error('Error fetching user profile:', err);
        throw err;
      }
};
