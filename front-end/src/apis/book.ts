import axios from 'axios';

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
