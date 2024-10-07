// apis/book.js

import axios from 'axios';

/**
 * Fetch books based on search criteria.
 * @param {string} title - Book title to search.
 * @param {number} minPrice - Minimum price.
 * @param {number} maxPrice - Maximum price.
 * @param {string} publisher - Publisher name.
 * @param {string} age - Age category.
 * @param {string} sortByPrice - Sort order ('asc' or 'desc').
 * @param {number} page - Page number for pagination.
 * @param {number} limit - Number of results per page.
 * @returns {Promise} - Promise resolving to a list of books.
 */
interface SearchBooksParams {
  title: string;
  minPrice?: number;  // Make optional
  maxPrice?: number;  // Make optional
  publisher?: string; // Make optional
  age?: string;       // Make optional
  sortByPrice?: 'asc' | 'desc';  // Make optional
  page: number;
  limit: number;
}

export const searchBooks = async ({ title, minPrice, maxPrice, publisher, age, sortByPrice, page, limit }: SearchBooksParams) => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/book/search', {
      params: { title, minPrice, maxPrice, publisher, age, sortByPrice, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error;
  }
};
