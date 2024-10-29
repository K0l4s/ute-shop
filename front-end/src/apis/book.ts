import axios from 'axios';
import { BASE_URL } from './base';

interface SearchBooksParams {
  title: string;
  minPrice?: number;
  maxPrice?: number;
  publisher?: string;
  minAge?: number;
  maxAge?: number;
  sortByPrice?: 'asc' | 'desc';
  page: number;
  limit: number;
}

export const searchBooks = async ({ title, minPrice, maxPrice, publisher, minAge, maxAge, sortByPrice, page, limit }: SearchBooksParams) => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/book/search', {
      params: { title, minPrice, maxPrice, publisher, minAge, maxAge, sortByPrice, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error;
  }
};

export const getTop10BooksAPI = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/book/top/10');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch top 10 books:", error);
    throw error;
  }
}

// export const updateProfileApis = async (
//   firstname: string, 
//   lastname: string, 
//   phone: string, 
//   gender: boolean, 
//   birthday: Date | null, 
//   avatar: File | null
// ) => {
//   const formData = new FormData(); 

//   formData.append('firstname', firstname);
//   formData.append('lastname', lastname);
//   formData.append('phone', phone);
//   formData.append('gender', gender.toString()); // Append gender as a string

//   if (birthday) {
//     formData.append('birthday', birthday.toISOString()); // If have birthday, append it
//   }

//   if (avatar) {
//     formData.append('avatar_url', avatar); // Append avatar file if it exists
//   }

//   try {
//     const response = await axios.put(
//       BASE_URL + '/user/profile/edit', 
//       formData,
//       {
//         withCredentials: true,
//         headers: { 'Content-Type': 'multipart/form-data' } 
//       }
//     );

//     return response.data;
//   } catch (err) {
//     console.error('Something went wrong: ', err);
//   }
// };


export const createBook = async (
  ISBN: string,
  title: string,
  desc: string,
  price: number,
  salePrice: number,
  year: Date,
  age: number,
  stock: number,
  cover_img_url: File | null
) => {
  const formData = new FormData();
  formData.append('ISBN', ISBN);
  formData.append('title', title);
  formData.append('desc', desc);
  formData.append('price', price.toString());
  formData.append('salePrice', salePrice.toString());
  formData.append('year', year.toISOString());
  formData.append('age', age.toString());
  formData.append('stock', stock.toString());

  if (cover_img_url) {
    formData.append('cover_img_url', cover_img_url);
  }
  // console.log(formData.getAll('cover_img_url'));
  try {
    const response = await axios.post(
      BASE_URL + '/book/create',
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