import { useEffect, useState } from 'react';
import { getOrderByUser } from '../../apis/order';
import { Order } from '../../models/OrderType';
import OrderDetail from './OrderDetail';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    getOrderByUser().then((res) => setOrders(res));
  }, []);

  const filterOrders = (status: typeof filteredStatus) => {
    setFilteredStatus(status);
  };

  const filteredOrders = filteredStatus === 'ALL' ? orders : orders.filter(order => order.status === filteredStatus);

  const handleCancelOrder = (orderId: number) => {
    console.log(`Cancel order #${orderId}`);
    // Code để hủy đơn hàng tại đây
  };

  const handleReorder = (orderId: number) => {
    console.log(`Reorder #${orderId}`);
    // Code để mua lại đơn hàng tại đây
  };

  const handleConfirmDelivery = (orderId: number) => {
    console.log(`Confirm delivery of order #${orderId}`);
    // Code để xác nhận nhận hàng tại đây
  };

  const isWithinCancelPeriod = (orderDate: string) => {
    const orderTime = new Date(orderDate).getTime();
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    return now - orderTime <= thirtyMinutes;
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-800 text-white min-h-screen rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Đơn hàng của tôi</h2>
      <div className="flex space-x-2 mb-4 overflow-x-auto text-black rounded-full">
        {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'].map(status => (
          <button key={status} onClick={() => filterOrders(status as typeof filteredStatus)} className={`px-4 py-2 ${filteredStatus === status ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            {status === 'ALL' ? 'Tất cả' : `Đơn hàng ${status.toLowerCase()}`}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <div>
          {filteredOrders.map(order => (
            <div key={order.id} className="mb-6 p-4 bg-gray-700 border border-gray-600 rounded-lg">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold">Đơn hàng #{order.id}</h3>
                <span className={`text-sm font-medium ${order.status === 'SHIPPED' ? 'text-green-500' : 'text-gray-400'}`}>
                  {order.status === 'SHIPPED' ? 'Đơn hàng đang giao' : order.status === 'DELIVERED' ? 'Đã hoàn thành' : ''}
                </span>
              </div>

              {order.orderDetails.map(detail => (
                <div key={detail.book.id} className="flex items-center mb-4">
                  <img src={detail.book.cover_img_url} alt={detail.book.title} className="w-16 h-20 mr-4 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="text-base font-semibold">{detail.book.title}</h4>
                    <p className="text-sm text-gray-300">Phân loại: {detail.book.category}</p>
                    <p className="text-sm text-gray-300">Số lượng: {detail.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-red-500">{detail.price} đ</p>
                    <p className="text-sm line-through text-gray-400">{detail.book.price} đ</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center border-t pt-2 mt-4">
                <div className='flex flex-col'>
                  <span className="text-lg font-semibold">Thành tiền: {order.total_price} đ</span>
                  <span className="text-sm text-gray-500">Ngày đặt: {new Date(order.order_date).toLocaleString()}</span>
                </div>
                <div className="flex p-5 space-x-3">
                  <button onClick={() => openModal(order)} className="bg-green-500 text-white px-4 py-2 rounded">Chi tiết</button>
                  {order.status === 'PENDING' && isWithinCancelPeriod(order.order_date) && (
                    <button onClick={() => handleCancelOrder(order.id)} className="bg-red-500 text-white px-4 py-2 rounded">Hủy đơn</button>
                  )}
                  {(order.status === 'CONFIRMED' || order.status === 'PROCESSING' || order.status === 'CANCELLED' || order.status === 'RETURNED') && (
                    <button onClick={() => handleReorder(order.id)} className="bg-blue-500 text-white px-4 py-2 rounded">Mua lại</button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <button onClick={() => handleConfirmDelivery(order.id)} className="bg-green-500 text-white px-4 py-2 rounded">Nhận hàng</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for Order Details */}
      {isModalOpen && selectedOrder && (
        <OrderDetail order={selectedOrder} onClose={closeModal} isOpen={isModalOpen}/>
      )}
    </div>
  );
};

export default Orders;
