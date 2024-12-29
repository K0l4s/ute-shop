import axios from "axios";
import { BASE_URL } from "./base";

export const getPublisher = async () => {
  try {
    const response = await axios.get(BASE_URL + "/publisher/all");
    return response.data;
  }
  catch (error) {
    console.error("Failed to fetch publishers:", error);
    throw error;
  }
}
interface Publisher {
  name: string;
  address: string;
}
export const createPublisher = async (
  publisher: Publisher
) => {
  try {
    const response = await axios.post(BASE_URL + "/publisher", publisher);
    return response.data;
  }
  catch (error) {
    console.error("Failed to create publisher:", error);
    throw error;
  }
}

export const updatePublisher = async (
  id: number,
  name: string,
  address: string
) => {
  try {
    const response = await axios.put(BASE_URL + `/publisher`, {id, name, address });
    return response.data;
  }
  catch (error) {
    console.error("Failed to update publisher:", error);
    throw error;
  }
}