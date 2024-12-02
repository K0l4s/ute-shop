import axios from "axios";
import { BASE_URL } from "./base";

// Function to login
export const loginApi = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      BASE_URL + `/auth/login`,
      { 
        email, 
        password 
      },
      { headers: 
        { 'Content-Type': 'application/json' }, 
        withCredentials: true 
      }
    );
    
    return response.data;
  } catch (err) {
    console.error('Có lỗi xảy ra: ', err);
    throw err;
  }
};

// Function to check authentication status
export const checkAuthStatusApi = async () => {
  try {
    const response = await axios.get(
      BASE_URL + '/auth/check', 
      { withCredentials: true });

    return response.data;
  } catch (err) {
    console.error('Error checking login status:', err);
    throw err;
  }
};

export const forgotPasswordApis = async (email: String) => {
    // Call API to send reset password email
    const response = await fetch('http://localhost:8080/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email
        }),
      });
    // const data = await response.json();
    // console.log('Data:', data);
    return response;
};

export const resetPasswordApis = async (email: String, password: String, code: String) => {
    // Call API to reset password
    const response = await fetch('http://localhost:8080/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          code
        }),
      });
    // const data = await response.json();
    // console.log('Data:', data);
    return response;
};

export const activeAccountApis = async (email: String, code: String) => {
    // Call API to reset password
    const response = await fetch('http://localhost:8080/api/v1/auth/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        code
      }),
    });
  // const data = await response.json();
  // console.log('Data:', data);
  return response;
};

export const changePasswordApi = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await axios.put(
      BASE_URL + '/auth/change-password',
      { oldPassword, newPassword },
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error('Có lỗi xảy ra: ', err);
    throw err;
  }
};