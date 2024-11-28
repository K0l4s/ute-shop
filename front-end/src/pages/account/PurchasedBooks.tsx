import React, { useEffect, useState } from 'react';
import { getPurchasedBooksByUser } from '../../apis/book';
import { showToast } from '../../utils/toastUtils';
import { addToCart } from '../../apis/cart';
import { LuPackageCheck } from 'react-icons/lu';
import { formatStar } from '../../utils/bookUtils';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../utils/dateUtils';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/reducers/cartSlice';

interface Book {
  id: number;
  ISBN: string;
  title: string;
  desc: string;
  price: string;
  salePrice: string | null;
  year: string;
  age: number;
  sold: number;
  stock: number;
  cover_img_url: string;
  avgRating: number;
  reviewCount: number;
}

interface PurchasedBook {
  book: Book;
  quantity: number;
  order_date: string;
}

const PurchasedBooks: React.FC = () => {
  const [purchasedBooks, setPurchasedBooks] = useState<PurchasedBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        const data = await getPurchasedBooksByUser();
        setPurchasedBooks(data.data);
      } catch (error) {
        console.error('Error fetching purchased books:', error);
      }
    };

    fetchPurchasedBooks();
  }, []);

  const handleAddToCart = async (book: Book) => {
    if (book.stock === 0) {
      showToast('Sản phẩm đã hết hàng', 'error');
      return;
    }

    try {
      await addToCart(book.id, 1);
      dispatch(addItem({
        id: book.id,
        title: book.title,
        price: parseFloat(book.price),
        salePrice: book.salePrice ? parseFloat(book.salePrice) : undefined,
        stars: book.avgRating,
        image: book.cover_img_url,
        quantity: 1,
        stock: book.stock,
        age: book.age.toString(),
        publisher: undefined,
        checked: false,
      }));
      showToast('Đã thêm thành công', 'success');
    } catch (error) {
      showToast('Đã xảy ra lỗi, vui lòng kiểm tra giỏ hàng', 'error');
    }
  };

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const totalPages = Math.ceil(purchasedBooks.length / itemsPerPage);
  const displayedBooks = purchasedBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="font-semibold p-4 bg-white mb-4 rounded-lg shadow-lg flex justify-between">
        <h2 className='text-xl text-violet-700'>
          <LuPackageCheck style={{ display: "inline-block", marginBottom: "3px", marginRight: "5px" }} />
          Sách đã mua
        </h2>
      </div>
      {purchasedBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-2">
            {displayedBooks.map(({ book, quantity, order_date }) => (
              <div key={book.id}
                className="p-4 shadow-lg rounded-lg bg-white flex flex-col"
                onClick={() => navigate(`/products/${book.id}`)}>
                <img
                  src={book.cover_img_url}
                  alt={book.title}
                  className="w-42 min-h-[120px] max-h-[150px] mb-4 object-cover object-fit rounded-xl shadow-xl mx-auto"
                />
                <h3 className="font-semibold">{book.title}</h3>
                <div>
                  <p className="text-xl text-red-500 font-semibold min-h-[24px]">
                    {formatPrice(book.salePrice || book.price || '0')}
                  </p>
                  {book.salePrice && (
                    <p className="line-through text-gray-500 min-h-[24px]">
                      {formatPrice(book.price || '0')}
                    </p>
                  )}
                </div>
                <div className="flex items-center my-2">
                  <label className='text-2xl flex'>{formatStar(book.avgRating)}</label>
                  <p className="text-xl">({book.reviewCount})</p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm">Đã mua {quantity} quyển</p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm">Đã mua lần cuối vào {formatDateTime(order_date)}</p>
                </div>
                <div className="mt-auto">
                  {book.stock === 0 ? (
                    <button
                      className="w-36 border-2 border-gray-200 bg-gray-200 
                      text-black font-semibold px-4 py-2 rounded mr-2 cursor-not-allowed">Hết hàng</button>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); handleAddToCart(book) }}
                      className="w-full border-2 border-violet-600 bg-violet-600 hover:bg-violet-700 
                      text-white font-semibold px-4 py-2 rounded mr-2 transition duration-300">Thêm vào giỏ</button>
                  )}
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
        <div className="w-full flex flex-col justify-center items-center mt-2 gap-4">
          <h4 className='font-bold text-xl'>Danh sách đã mua đang trống</h4>
          <img src="/emptyHistory.jpeg" alt="Empty History" className="w-1/3 h-auto rounded" />
        </div>
      )}
    </div>
  );
};

export default PurchasedBooks;