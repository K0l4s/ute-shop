import axios from "axios";
import { BASE_URL } from "./base";

export const getWallet = async () => {
  try {
    const response = await axios.get(BASE_URL + "/wallet", { withCredentials: true });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addBalanceToWallet = async (amount: number) => {
  try {
    const response = await axios.put(BASE_URL + "/wallet/add", amount, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};