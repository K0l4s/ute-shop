// apis/book.js

import axios from 'axios';

/**
 * Fetch books based on search criteria.
 * @param {string} title 
 * @param {number} minPrice 
 * @param {number} maxPrice 
 * @param {string} publisher 
 * @param {number} minAge 
 * @param {number} maxAge 
 * @param {string} sortByPrice 
 * @param {number} page 
 * @param {number} limit 
 * @returns {Promise} - Promise resolving to a list of books.
 */
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
