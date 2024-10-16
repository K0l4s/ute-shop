import axios from 'axios';

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