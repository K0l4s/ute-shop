import axios from "axios";
import { BASE_URL, PROVINE_OPEN_API, DISTRICT_OPEN_API, WARD_OPEN_API } from "./base";

// Function to get user profile
export const getProfileApi = async () => {
  try {
    const response = await axios.get(
      BASE_URL + '/user/profile', 
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    throw err;
  }
};

// Function to update user profile
export const updateProfileApis = async (
  firstname: string, 
  lastname: string, 
  phone: string, 
  gender: boolean, 
  birthday: Date | null, 
  avatar: File | null
) => {
  const formData = new FormData(); 

  formData.append('firstname', firstname);
  formData.append('lastname', lastname);
  formData.append('phone', phone);
  formData.append('gender', gender.toString()); // Append gender as a string

  if (birthday) {
    formData.append('birthday', birthday.toISOString()); // If have birthday, append it
  }
  
  if (avatar) {
    formData.append('avatar_url', avatar); // Append avatar file if it exists
  }

  try {
    const response = await axios.put(
      BASE_URL + '/user/profile/edit', 
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' } 
      }
    );

    return response.data;
  } catch (err) {
    console.error('Something went wrong: ', err);
  }
};

// Function to update user location
export const updateLocationApis = async (
  province: string,
  district: string,
  ward: string,
  address: string
) => {
  try {
    const response = await axios.put(
      BASE_URL + '/user/profile/location/edit', 
      { province, district, ward, address },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error('Error updating location:', err);
    throw err;
  }
}

// Function to fetch provinces, districts, and wards data //
export const getProvinces = async () => {
  try {
    const response = await axios.get(PROVINE_OPEN_API);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch provinces:", error);
    throw error;
  }
};

export const getDistrictsByProvince = async (provinceCode: number) => {
  try {
    const response = await axios.get(DISTRICT_OPEN_API + `${provinceCode}?depth=2`);
    return response.data.districts;
  } catch (error) {
    console.error("Failed to fetch districts:", error);
    throw error;
  }
};

export const getWardsByDistrict = async (districtCode: number) => {
  try {
    const response = await axios.get(WARD_OPEN_API + `${districtCode}?depth=2`);
    return response.data.wards;
  } catch (error) {
    console.error("Failed to fetch wards:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(BASE_URL + '/user/all', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};
//
