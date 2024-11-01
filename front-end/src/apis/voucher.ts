import axios from "axios";
import { BASE_URL } from "./base";

export const getDiscountVouchers = async () => {
  try {
    const response = await axios.get(BASE_URL + "/voucher/discounts/all", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getFreeshipVouchers = async () => {
  try {
    const response = await axios.get(BASE_URL + "/voucher/freeships/all", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};