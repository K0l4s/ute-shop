import React, { useState } from 'react';
import BookCard from '../../components/productInfo/BookCard';
import SearchFilter from '../../components/filter/SeachFilter';
import SortFilter from '../../components/filter/SortFilter';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type Book = {
  id: number;
  title: string;
  price: number;
  salePrice?: number;
  stars: number;
  image: string;
  publisher: string;
  age: string;
};

const SearchResults: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([
    { id: 1, title: 'Dế mèn phiêu lưu ký - Tô Hoài edition - Phiên bản giới hạn - Limited Edition', price: 600000, salePrice: 500000, stars: 4, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Adult' },
    { id: 2, title: 'Book B', price: 80, stars: 5, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher B', age: 'Teen' },
    { id: 3, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 4, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 5, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 6, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 7, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 8, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 9, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 10, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 11, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 12, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 13, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 14, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 15, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 16, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 17, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 18, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 19, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 20, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 21, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 22, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 23, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    { id: 24, title: 'Book C', price: 40, stars: 3, image: 'https://cdn.lisaangel.co.uk/image/cache/data/product-images/ss23/af/vintage-novel-birthday-card-443a7400-620x620.jpeg', publisher: 'Publisher A', age: 'Kids' },
    // Thêm sách khác tại đây
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 16;

  // Tính toán số trang
  const totalPages = Math.ceil(books.length / booksPerPage);

  // Chia sách theo từng trang
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const handleAddToCart = (id: number) => {
    console.log(`Book ${id} added to cart`);
  };

  const handleBuyNow = (id: number) => {
    console.log(`Book ${id} bought now`);
  };

  const handleFilterChange = (filter: string) => {
    console.log('Selected filter:', filter);
  };

  const handleSortChange = (sort: string) => {
    console.log('Selected sort:', sort);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  return (
    <div className="container mx-auto p-4 flex gap-4">
      <div className="w-1/5">
        <SearchFilter onFilterChange={handleFilterChange} />
      </div>
      <div className="w-4/5">
        <div className="flex border rounded mb-4 items-center">
          <span className='w-2/3 pl-4 font-bold'>KẾT QUẢ TÌM KIẾM (99)</span>
          <div className="w-1/3">
            <SortFilter onSortChange={handleSortChange} />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentBooks.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              desc={''}
              price={book.price}
              salePrice={book.salePrice}
              stars={book.stars}
              image={book.image}
              onAddToCart={() => handleAddToCart(book.id)}
              onBuyNow={() => handleBuyNow(book.id)}
            />
          ))}
          
        </div>
        
        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            className={`px-4 py-3 border ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IoIosArrowBack />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`px-4 py-3 border ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IoIosArrowForward />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SearchResults;
