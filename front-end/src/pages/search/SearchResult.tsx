import React, { useEffect, useState } from 'react';
import BookCard from '../../components/productInfo/BookCard';
import SearchFilter from '../../components/filter/SeachFilter';
import SortFilter from '../../components/filter/SortFilter';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
// import { useDispatch } from 'react-redux';
// import { addItem } from '../../redux/reducers/cartSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchBooks } from '../../apis/book';
import { getPublisher } from '../../apis/publisher';
import { addToCart } from '../../apis/cart';
import { showToast } from '../../utils/toastUtils';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/reducers/cartSlice';

type Publisher = {
  id: number;
  name: string;
  address: string;
};

type Book = {
  id: number;
  title: string;
  desc: string;
  price: number;
  salePrice?: number;
  year: string;
  stock: number;
  cover_img_url: string;
  avgRating: number;
  reviewCount: number;
  total_sold: number;
  age: string;
};

const SearchResults: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Extract search query from the URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  type Filters = {
    [key: string]: string | undefined;
    price?: string;
    publisher?: string;
    minPrice?: string;
    maxPrice?: string;
  };

  const [filters, setFilters] = useState<Filters>({
    price: searchParams.get('price') || undefined,
    publisher: searchParams.get('publisher') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
  });
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let minPrice, maxPrice;
        switch (filters.price) {
          case '< 50.000':
            minPrice = 0;
            maxPrice = 50000;
            break;
          case '50.000 - 100.000':
            minPrice = 50000;
            maxPrice = 100000;
            break;
          case '> 100.000':
            minPrice = 100000;
            maxPrice = undefined; // Giá trị lớn hơn 100000
            break;
          default:
            minPrice = undefined;
            maxPrice = undefined;
        }

        const params = {
          ...filters,
          title: query,
          page: currentPage,
          limit: 8,
          minPrice: minPrice,
          maxPrice: maxPrice,
        };

        const response = await searchBooks(params);

        // Cập nhật state với dữ liệu từ API
        setBooks(response.data);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, [query, currentPage, filters]); // Gọi API mỗi khi query hoặc currentPage thay đổi

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await getPublisher();
        setPublishers(response.data);
      } catch (error) {
        console.error('Failed to fetch publishers:', error);
      }
    };

    fetchPublishers();
  }, []);

  const dispatch = useDispatch();

  const handleAddToCart = async (book: Book) => {
    try {
      await addToCart(book.id, 1);
      const cartItem = {
          id: book.id,
          title: book.title,
          price: book.price,
          salePrice: book.salePrice,
          image: book.cover_img_url,
          stars: book.avgRating,
          age: book.age,
          quantity: 1, //Mặc định thêm 1 sản phẩm vào giỏ
          stock: book.stock,
          checked: true, // Mặc định là đã chọn sản phẩm
      };
      dispatch(addItem(cartItem));
      showToast('Đã thêm thành công', 'success');
    } catch(error){
      showToast('Đã xảy ra lỗi', 'error');
    }  
  };

  // const handleBuyNow = (id: number) => {
  //   console.log(`Book ${id} bought now`);
  // };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => {
      if (prevFilters[key] === value) {
        // Nếu filter hiện tại đã chọn, bỏ chọn filter đó
        const { [key]: removed, ...rest } = prevFilters;
        return rest;
      }
      return { ...prevFilters, [key]: value };
    });
  };

  const handleSortChange = (sort: string) => {
    console.log('Selected sort:', sort);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      navigate(`/search?query=${query}&page=${pageNumber}`);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (filters.price) {
      params.set('price', filters.price);
    } else {
      params.delete('price');
    }
    if (filters.publisher) {
      params.set('publisher', filters.publisher);
    } else {
      params.delete('publisher');
    }
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice);
    } else {
      params.delete('minPrice');
    }
    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice);
    } else {
      params.delete('maxPrice');
    }
    navigate({ search: params.toString() });
  }, [filters, navigate, location.search]);

  return (
    <div className="container mx-auto p-4 flex gap-4">
      <div className="w-1/5">
        <SearchFilter onFilterChange={handleFilterChange} publishers = {publishers} selectedFilters={filters}/>
      </div>
      <div className="w-4/5">
        <div className="flex border rounded mb-4 items-center bg-white">
          <span className='w-2/3 pl-4 font-bold'>
            KẾT QUẢ TÌM KIẾM
            ({books.length})
          </span>
          <div className="w-1/3">
            <SortFilter onSortChange={handleSortChange} />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {books.length === 0 && (
            <div className="col-span-4 flex justify-center items-center bg-white font-semibold p-4 h-[70vh] rounded border">
              Không tìm thấy sách phù hợp
            </div>
          )}
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              price={book.price.toString()}
              salePrice={book.salePrice?.toString()}
              cover_img_url={book.cover_img_url}
              avgRating={book.avgRating}
              reviewCount={book.reviewCount}
              totalSold={book.total_sold}
              onAddToCart={() => handleAddToCart(book)}
            />
          ))}
          
        </div>
        
        {/* Pagination Controls */}
        {books.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default SearchResults;
