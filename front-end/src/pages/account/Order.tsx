import { useEffect, useState } from 'react';
import { getOrderByUser, searchOrdersByUser, updateCartStatus } from '../../apis/order';
import { Order, Book, OrderDetail } from '../../models/OrderType';
import OrderDetailModal from './OrderDetailModal';
import { showToast } from '../../utils/toastUtils';
import { FiPackage } from 'react-icons/fi';
import { IoInformationCircleOutline, IoSearchSharp } from 'react-icons/io5';
import { formatStatus } from '../../utils/orderUtils';
import { formatPriceToVND } from '../../utils/bookUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../utils/dateUtils';
import { addToCart } from '../../apis/cart';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/reducers/cartSlice';

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialStatus = params.get('status') as 'ALL' | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERED' | 'SHIPPED' | 'CANCELLED' | 'RETURNED' || 'ALL';
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERED' | 'SHIPPED' | 'CANCELLED' | 'RETURNED'>(initialStatus);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // const [totalOrders, setTotalOrders] = useState(0); 

  const dispatch = useDispatch();

  const fetchOrders = async (status: string, limit: number, offset: number) => {
    try {
      const newOrders = await getOrderByUser(status, limit, offset);
      if (Array.isArray(newOrders)) {
        setOrders(prevOrders => [...prevOrders, ...newOrders]);
        setOffset(prevOffset => prevOffset + limit);
        // setTotalOrders(prevTotal => prevTotal + newOrders.length);

        if (newOrders.length < limit) {
          setHasMore(false);
        }
      } else {
        console.error('Expected an array of orders, but received:', newOrders);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchOrders = async (status: string, query: string) => {
    try {
      const searchedOrders = await searchOrdersByUser(status, query);
      if (Array.isArray(searchedOrders)) {
        setOrders(searchedOrders);
      } else {
        console.error('Expected an array of orders, but received:', searchedOrders);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setOrders([]);
    setOffset(0);
    setHasMore(true);
    // setTotalOrders(0);
    fetchOrders(filteredStatus, 5, 0);
  }, [filteredStatus]);

  // for history navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('orderId');
    const status = params.get('status');
    if (status) {
      setFilteredStatus(status as typeof filteredStatus);
    }
    if (orderId) {
      setSelectedOrder(Number(orderId));
      setIsModalOpen(true);
    }
  }, [location.search]);


  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchQuery.trim() === '') {
        setOrders([]);
        setOffset(0);
        setHasMore(true);
        fetchOrders(filteredStatus, 5, 0);
      } else {
        searchOrders(filteredStatus, searchQuery);
      }
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      fetchOrders(filteredStatus, 5, offset);
    }
  };

  const filterOrders = (status: typeof filteredStatus) => {
    setFilteredStatus(status);
    const params = new URLSearchParams(location.search);
    params.set('status', status);
    navigate({ search: params.toString() });
  };

  // const filteredOrders = filteredStatus === 'ALL' ? orders : orders.filter(order => order.status === filteredStatus);

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
        salePrice: undefined,
        stars: undefined,
        image: book.cover_img_url,
        quantity: 1,
        stock: 1,
        age: undefined,
        publisher: undefined,
        checked: false,
      }));
      showToast('Đã thêm sản phẩm #' + book.id + ' giỏ', 'success');
    } catch(error){
      showToast('Đã xảy ra lỗi, vui lòng kiểm tra giỏ hàng', 'error');
    }  
  };
  
  const handleCancelOrder = (orderId: number) => {
    console.log(`Cancel order #${orderId}`);
    updateCartStatus(orderId.toString(), 'CANCELLED').then(() => {
      const params = new URLSearchParams(location.search);
      params.set('status', 'CANCELLED');
      navigate({ search: params.toString() });
      showToast('Hủy đơn hàng thành công', 'success');
    }).catch((err) => {
      console.log(err);
      showToast('Có lỗi xảy ra khi hủy đơn hàng: ' + err.message, 'error');
    });
  };

  const handleReorder = async (orderDetails: OrderDetail[]) => {
    for (const detail of orderDetails) {
      await handleAddToCart(detail.book);
    }
  };

  const handleConfirmDelivery = (orderId: number) => {
    console.log(`Confirm delivery of order #${orderId}`);
    updateCartStatus(orderId.toString(), 'SHIPPED').then(() => {
      const params = new URLSearchParams(location.search);
      params.set('status', 'SHIPPED');
      navigate({ search: params.toString() });
      showToast('Xác nhận nhận hàng thành công', 'success');
    }).catch((err) => {
      console.log(err);
      showToast('Có lỗi xảy ra khi xác nhận nhận hàng: ' + err.message, 'error');
    });
    // Code để xác nhận nhận hàng tại đây
  };
  const handleReturn = (orderId: number) => {
    console.log(`Request return of order #${orderId}`);
    updateCartStatus(orderId.toString(), 'RETURNED').then(() => {
      const params = new URLSearchParams(location.search);
      params.set('status', 'RETURNED');
      navigate({ search: params.toString() });
      showToast("Yêu cầu trả hàng đã được gửi", 'success');
    }).catch((err) => {
      console.log(err);
      showToast('Có lỗi xảy ra khi yêu cầu trả hàng: ' + err.message, 'error');
    });
    // Code để yêu cầu trả hàng tại đây
  };

  const isWithinCancelPeriod = (orderDate: string) => {
    const orderTime = new Date(orderDate).getTime();
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    return now - orderTime <= thirtyMinutes;
  };
  const isWithinReturnPeriod = (orderDate: string) => {
    const orderTime = new Date(orderDate).getTime();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return now - orderTime <= sevenDays;
  };
  const openModal = (orderId: number) => {
    setSelectedOrder(orderId);
    setIsModalOpen(true);
    const params = new URLSearchParams(location.search);
    params.set('orderId', orderId.toString());
    navigate({ search: params.toString() });
    // navigate(`?orderId=${orderId}`);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
    const params = new URLSearchParams(location.search);
    params.delete('orderId');
    navigate({ search: params.toString() });
    // navigate(location.pathname);
  };

  const filteredOrdersBySearch = orders.filter(order =>
    order.orderDetails.some(detail =>
      detail.book.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  return (
    <div className="p-6 bg-white shadow-lg rounded-md min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-violet-700">
        <FiPackage style={{display: "inline-block", marginBottom: "3px", marginRight: "5px"}} />
        Đơn hàng của tôi
      </h2>
      <div className="flex space-x-2 mb-4 overflow-x-auto justify-around border-gray-400 border rounded-t-lg">
        <button onClick={() => filterOrders('ALL')} className={`px-4 py-2 font-semibold ${filteredStatus === 'ALL' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Tất cả</button>
        <button onClick={() => filterOrders('PENDING')} className={`px-4 py-2 font-semibold ${filteredStatus === 'PENDING' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đang chờ</button>
        <button onClick={() => filterOrders('CONFIRMED')} className={`px-4 py-2 font-semibold ${filteredStatus === 'CONFIRMED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đã xác nhận</button>
        <button onClick={() => filterOrders('PROCESSING')} className={`px-4 py-2 font-semibold ${filteredStatus === 'PROCESSING' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đang xử lý</button>
        <button onClick={() => filterOrders('DELIVERED')} className={`px-4 py-2 font-semibold ${filteredStatus === 'DELIVERED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đang giao hàng</button>
        <button onClick={() => filterOrders('SHIPPED')} className={`px-4 py-2 font-semibold ${filteredStatus === 'SHIPPED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đã nhận hàng</button>
        <button onClick={() => filterOrders('CANCELLED')} className={`px-4 py-2 font-semibold ${filteredStatus === 'CANCELLED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đã hủy</button>
        <button onClick={() => filterOrders('RETURNED')} className={`px-4 py-2 font-semibold ${filteredStatus === 'RETURNED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đã trả hàng</button>
      </div>

      <div className="relative mb-4">
        <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        <input
          type="text"
          placeholder="Nhập tên sách cần tìm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          className="pl-10 py-2 border border-gray-400 w-full"
        />
      </div>

      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <div>
          {filteredOrdersBySearch.map(order => (
            <div key={order.id} className="mb-6 p-4 bg-white border border-gray-400">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-base text-violet-700 font-semibold">ĐƠN HÀNG #{order.id}</h3>
                <span className={`text-sm font-medium ${order.status ? 'text-green-500' : 'text-gray-500'}`}>
                  <IoInformationCircleOutline style={{display: "inline-block"}} size={32} />
                  {formatStatus(order.status).toUpperCase()}
                </span>
              </div>

              <div className="bg-blue-50 p-4 rounded">
                {order.orderDetails.map(detail => (
                  <div key={detail.book.id} className="flex items-center mb-4 cursor-pointer" onClick={() => navigate(`/products/${detail.book.id}`)}>
                    <img src={detail.book.cover_img_url} alt={detail.book.title} className="w-16 h-20 mr-4 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="text-base font-semibold">{detail.book.title}</h4>
                      <p className="text-sm text-gray-600">Phân loại: {detail.book.category?.name || ""}</p>
                      <p className="text-sm text-gray-600">Số lượng: {detail.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-red-500">{formatPriceToVND(detail.price)} đ</p>
                      <p className="text-sm line-through text-gray-500">{formatPriceToVND(detail.book.price)} đ</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col items-end border-t pt-2 mt-4">
                <div className='flex flex-col items-end p-2'>
                  <span className="text-lg font-semibold">Thành tiền: 
                    <span className='text-red-500 ml-4'>{formatPriceToVND(order.total_price)} đ</span>
                  </span>
                  <span className="text-sm text-gray-700">Ngày đặt: {formatDateTime(order.order_date)}</span>
                </div>
                <div className="flex p-2 space-x-3">
                  <button onClick={() => openModal(order.id)} className="font-semibold text-blue-500 border border-blue-500 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transition duration-300">Chi tiết</button>
                  {order.status === 'PENDING'
                    &&
                    isWithinCancelPeriod(order.order_date) &&
                    (
                      <button onClick={() => handleCancelOrder(order.id)} className="bg-red-500 font-semibold text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Hủy đơn</button>
                  )}
                  {(order.status === 'CANCELLED' || order.status === 'RETURNED') && (
                    <button onClick={() => handleReorder(order.orderDetails)} className="bg-red-500 font-semibold text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Mua lại</button>
                  )}
                  {order.status === 'DELIVERED' && (
                    <button onClick={() => handleConfirmDelivery(order.id)} className="bg-green-500 font-semibold text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">Nhận hàng</button>
                  )}
                  {order.status === 'SHIPPED' && isWithinReturnPeriod(order.updatedAt) &&(
                    <button onClick={() => handleReturn(order.id)} className="border border-red-600 font-semibold text-red-600 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition duration-300">Yêu cầu trả hàng</button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center mt-4">
              <button onClick={handleLoadMore} className="px-4 py-2 text-violet-700 border hover:border-violet-700 rounded">Xem thêm</button>
            </div>
          )}

        </div>
      )}
      
      {/* Modal for Order Details */}
      {isModalOpen && selectedOrder && (
        <OrderDetailModal orderId={selectedOrder} onClose={closeModal} isOpen={isModalOpen}/>
      )}
    </div>
  );
};

export default Orders;
