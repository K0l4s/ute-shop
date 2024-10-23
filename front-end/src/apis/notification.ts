import axios from "axios";
import { BASE_URL } from "./base";

export const getNotifications = async () => {
  try {
    const response = await axios.get(BASE_URL + '/notification/all', { withCredentials: true});
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
}