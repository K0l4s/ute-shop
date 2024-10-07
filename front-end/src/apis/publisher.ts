import axios from "axios";

export const getPublisher = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/v1/publisher/all");
    return response.data;
  }
  catch (error) {
    console.error("Failed to fetch publishers:", error);
    throw error;
  }
}