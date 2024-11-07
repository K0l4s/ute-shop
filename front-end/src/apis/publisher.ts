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
interface Publisher {
  name: string;
  address: string;
}
export const createPublisher = async (
  publisher: Publisher
) => {
  try {
    const response = await axios.post("http://localhost:8080/api/v1/publisher", publisher);
    return response.data;
  }
  catch (error) {
    console.error("Failed to create publisher:", error);
    throw error;
  }
}
