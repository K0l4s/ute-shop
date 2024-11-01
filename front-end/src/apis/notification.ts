import axios from "axios";
import { BASE_URL } from "./base";

export const getNotifications = async (limit: number, offset: number) => {
  try {
    const response = await axios.get(BASE_URL + `/notification/all?limit=${limit}&offset=${offset}`, { withCredentials: true});
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
}