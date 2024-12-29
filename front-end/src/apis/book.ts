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
    const response = await axios.get(BASE_URL + '/book/search', {
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
    const response = await axios.get(BASE_URL + '/book/top/10');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch top 10 books:", error);
    throw error;
  }
}

export const createBook = async (
  ISBN: string,
  title: string,
  desc: string,
  price: number,
  salePrice: number,
  year: Date,
  age: number,
  stock: number,
  cover_img_url: File | null,
  author_id: number,
  publisher_id: number
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
  formData.append('author_id', author_id.toString());
  formData.append('publisher_id', publisher_id.toString());

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

export const getBooksByListId = async (ids: number[]) => {
  try {
    const response = await axios.post(BASE_URL + "/book/getByList", 
      { ids },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Something went wrong: ', error);
  }
};

export const getPurchasedBooksByUser = async () => {
  try {
    const response = await axios.post(BASE_URL + '/book/purchased', {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Something went wrong: ', error);
  }
};