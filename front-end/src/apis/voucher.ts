import axios from "axios";
import { BASE_URL } from "./base";

export const getDiscountVouchers = async (limit: number, offset: number) => {
  try {
    const response = await axios.get(BASE_URL + `/voucher/discounts/all?limit=${limit}&offset=${offset}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getFreeshipVouchers = async (limit: number, offset: number) => {
  try {
    const response = await axios.get(BASE_URL + `/voucher/freeships/all?limit=${limit}&offset=${offset}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateDiscountVoucher = async (id: string, data: any) => {
  try {
    const response = await axios.put(BASE_URL + `/voucher/discounts/update/${id}`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateFreeshipVoucher = async (id: string, data: any) => {
  try {
    const response = await axios.put(BASE_URL + `/voucher/freeships/update/${id}`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};