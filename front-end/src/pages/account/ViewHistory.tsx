import React, { useEffect, useState } from "react";
import { getBooksByListId } from "../../apis/book";
import { FaHistory, FaRegTrashAlt } from "react-icons/fa";
import { formatStar } from "../../utils/bookUtils";
import { addToCart } from "../../apis/cart";
import { showToast } from "../../utils/toastUtils";

interface Book {
  id: number;
  ISBN: string;
  title: string;
  desc: string;
  price: string;
  salePrice: string;
  year: string;
  stock: number;
  cover_img_url: string;
  publisher_id: number;
  author_id: number;
  category_id: number;
  avgRating: number;
  reviewCount: number;
  totalSell: number;
}

const ViewHistory: React.FC = () => {
  const [viewedBooks, setViewedBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchViewedBooks = async () => {
      const storedBookIds = JSON.parse(localStorage.getItem('viewedBooks') || '[]');
      if (storedBookIds.length > 0) {
        try {
          const response = await getBooksByListId(storedBookIds);
          const books = response.data;
          
          // Sort books according to the order of IDs in local storage
          const sortedBooks = storedBookIds.map((id: number) => books.find((book: Book) => book.id === id)).filter(Boolean);
          setViewedBooks(sortedBooks);
        } catch (error) {
          console.error('Failed to fetch viewed books:', error);
        }
      }
    };

    fetchViewedBooks();
  }, []);

  const handleRemoveAllHistory = () => {
    localStorage.removeItem('viewedBooks');
    setViewedBooks([]);
  }
  
  const handleRemoveFromHistory = (bookId: number) => {
    const updatedBookIds = JSON.parse(localStorage.getItem('viewedBooks') || '[]').filter((id: number) => id !== bookId);
    localStorage.setItem('viewedBooks', JSON.stringify(updatedBookIds));
    setViewedBooks(viewedBooks.filter(book => book.id !== bookId));
  }

  const handleAddToCart = async (book: Book) => {
    if (book.stock === 0) {
      showToast('Sản phẩm đã hết hàng', 'error');
      return;
    }

    try {
      await addToCart(book.id, 1);
      showToast('Đã thêm thành công', 'success');
    } catch(error){
      showToast('Đã xảy ra lỗi, vui lòng kiểm tra giỏ hàng', 'error');
    }  
  };

  // formatPrioce to locale string vn-Vn
  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  
  const totalPages = Math.ceil(viewedBooks.length / itemsPerPage);
  const displayedBooks = viewedBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="font-semibold  p-4 bg-white mb-4 rounded-lg shadow-lg flex justify-between">
        <h2 className='text-xl text-violet-700'>
          <FaHistory style={{display: "inline-block", marginBottom: "3px", marginRight: "5px"}} />
          Đã xem gần đây
        </h2>
        <button onClick={handleRemoveAllHistory} className='text-base text-violet-600 hover:text-violet-700 relative group'>
          <span className="tooltip opacity-0 group-hover:opacity-100 absolute -bottom-8 left-1/2 
            transform -translate-x-1/2 bg-gray-700 text-white text-sm rounded py-1 px-2 transition-opacity duration-300 whitespace-nowrap">
            Xóa tất cả
          </span>
          <FaRegTrashAlt size={24}/>
        </button>
      </div>
      {viewedBooks.length > 0 ? (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-2">
          {displayedBooks.map((book) => (
            <div key={book.id} className="p-4 shadow-lg rounded-lg bg-white flex flex-col">
              <img
                src={book.cover_img_url}
                alt={book.title}
                className="w-42 min-h-[120px] max-h-[150px] mb-4 object-cover object-fit rounded-xl shadow-xl mx-auto"
              />
              <h3 className="font-semibold">{book.title}</h3>
              <div>
                <p className="text-xl text-red-500 font-semibold min-h-[24px]">
                  {book.salePrice ? `${formatPrice(book.salePrice)}` : ''}
                </p>
                <p className="line-through text-gray-500 min-h-[24px]">
                  {book.price ? `${formatPrice(book.price)}` : ''}
                </p>
              </div>
              <div className="flex items-center my-2">
                <label className='text-2xl flex'>{formatStar(book.avgRating)}</label>
                <p className="text-xl">({book.reviewCount})</p>
              </div>
              
              <div className="mt-auto">
                {book.stock === 0 ? (
                  <button
                    className="w-36 border-2 border-gray-200 bg-gray-200 
                    text-black font-semibold px-4 py-2 rounded mr-2 cursor-not-allowed">Hết hàng</button>
                ) : (
                  <button onClick={() => handleAddToCart(book)}
                    className="w-36 border-2 border-violet-600 bg-violet-600 hover:bg-violet-700 
                    text-white font-semibold px-4 py-2 rounded mr-2">Thêm vào giỏ</button>
                )}
                
                <button onClick={() => handleRemoveFromHistory(book.id)} 
                  className="w-24 border-2 border-rose-600 hover:bg-rose-600 
                    text-black hover:text-white font-semibold px-6 py-2 rounded transition duration-4000">Xóa</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Tiếp
            </button>
          </div>
        </>
      ) : (
        <>
        <div className="w-full flex flex-col justify-center items-center mt-2 gap-4">
          <h4 className='font-bold text-xl'>Không tìm thấy lịch sử</h4>
          <img src="/emptyHistory.jpeg" alt="Empty History" className="w-1/3 h-auto rounded" />
        </div>
        </>
      )}
    </div>
  );
}

export default ViewHistory;