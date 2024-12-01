import React, { useEffect, useState } from "react";
import { searchBooks } from "../apis/book";
import { showToast } from "../utils/toastUtils";
import BookCard from "../components/productInfo/BookCard";
import { addToCart } from "../apis/cart";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/reducers/cartSlice";

const BookPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const fetchBooks = async (page: number) => {
    setLoading(true);
    try {
      const response = await searchBooks({ title: "", page, limit: 8 });
      setBooks((prevBooks) => [...prevBooks, ...response.data]);
      setTotalPages(response.totalPages);
    } catch (error) {
      showToast("Failed to fetch books", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const loadMoreBooks = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleAddToCart = async (book: any) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Các sản phẩm của UTE Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            price={book.price}
            salePrice={book.salePrice}
            cover_img_url={book.cover_img_url}
            avgRating={parseFloat(book.avgRating)}
            reviewCount={book.reviewCount}
            totalSold={parseInt(book.total_sold)}
            onAddToCart={() => handleAddToCart(book)}
          />
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {page < totalPages && !loading && (
        <button
          onClick={loadMoreBooks}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mx-auto flex justify-between"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default BookPage;