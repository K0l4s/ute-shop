import React, { useState } from 'react';
import { FaTimes, FaTruck } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';
import { BiLoaderCircle } from 'react-icons/bi';

interface OrderDetail {
    id: number;
    order_id: number;
    book_id: number;
    quantity: number;
    price: string;
    updatedAt: string;
    book: {
        id: number;
        ISBN: string;
        title: string;
        desc: string;
        price: string;
        salePrice: string;
        year: string;
        age: number;
        sold: number;
        stock: number;
        cover_img_url: string;
        publisher_id: number;
        author_id: number;
        category_id: number;
    };
}

interface Order {
    id: number;
    user_id: number;
    discount_id: number | null;
    freeship_id: number | null;
    total_price: string;
    order_date: string;
    shipping_address: string;
    shipping_method: string;
    shipping_fee: string;
    status: string;
    updatedAt: string;
    orderDetails: OrderDetail[];
    user: {
        id: number;
        firstname: string;
        lastname: string;
    };
}

interface OrderModalProps {
    order: Order;
    isOpen: boolean;
    closeModal: () => void;
    updateOrderStatus: (orderId: number, status: string, successMessage: string) => void;
}

const AdminDetailOrder: React.FC<OrderModalProps> = ({ order, isOpen, closeModal, updateOrderStatus }) => {
    const [loading, setLoading] = useState<string | null>(null); // Thêm state để theo dõi trạng thái loading
    const [orderStatus, setOrderStatus] = useState(order.status);

    if (!isOpen) return null;

    // Các hàm chức năng cập nhật trạng thái đơn hàng
    const confirmOrd = (orderId: number) => {
        setLoading('CONFIRMING');
        updateOrderStatus(orderId, 'CONFIRMED', "Đã xác nhận đơn hàng")
        setOrderStatus('CONFIRMED')
    };
    const progress = (orderId: number) => {
        setLoading('PROCESSING');
        updateOrderStatus(orderId, 'PROCESSING', "Đã xử lý đơn hàng")
        setOrderStatus('PROCESSING')
    };
    const ship = (orderId: number) => {
        setLoading('SHIPPING');
        updateOrderStatus(orderId, 'DELIVERED', "Đã gửi hàng")
        setOrderStatus('DELIVERED')
    };
    const getStatusClassName = (status: string) => {
        const statusClasses: Record<string, string> = {
          PENDING: 'bg-yellow-100 text-yellow-800',
          CONFIRMED: 'bg-blue-100 text-blue-800',
          PROCESSING: 'bg-purple-100 text-purple-800',
          SHIPPED: 'bg-indigo-100 text-indigo-800',
          DELIVERED: 'bg-green-100 text-green-800',
          CANCELLED: 'bg-red-100 text-red-800',
          RETURNED: 'bg-gray-100 text-gray-800',
        };
        return statusClasses[status] || 'bg-gray-200 text-gray-600';
      };
      const convertToVNTime = (time: string) => {
          const date = new Date(time);
          return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      }
    const formatPrice = (price: string) => new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(parseInt(price));
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 p-8 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Chi tiết đơn hàng #{order.id}</h2>
                    <button
                        onClick={closeModal}
                        className="text-xl text-gray-500 hover:text-gray-800 transition-all duration-300"
                    >
                        <FaTimes />
                    </button>
                </div>

                

                <div className="space-y-6">
                    {/* Customer Information Section */}
                    <section>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Thông tin vận chuyển</h3>
                        <div className="grid grid-cols-2 gap-x-8">
                            <div>
                                <p><strong>Tên khách hàng:</strong> {order.user.firstname} {order.user.lastname}</p>
                                <p><strong>Thời gian đặt hàng:</strong> {convertToVNTime(order.order_date)}</p>
                                <div className='flex items-center gap-2'>
                                    <span className='flex'><strong>Trạng thái đơn:</strong> <p className={`rounded-full p-1 px-2 ${getStatusClassName(orderStatus)}`}>{orderStatus}</p></span>
                                    {/* Conditionally Render Buttons Based on Status */}
                                    <div className={`flex justify-between`}>
                                        {orderStatus === "PENDING" && (
                                            <button
                                                onClick={() => confirmOrd(order.id)}
                                                className={`flex items-center ${loading === 'CONFIRMING' ? 'text-gray-400' : 'text-green-600'} hover:text-green-800 transition duration-200`}
                                                disabled={loading === 'CONFIRMING'}
                                            >
                                                {loading === 'CONFIRMING' ? <BiLoaderCircle size={20} className="animate-spin" /> : <GiConfirmed size={20} />}
                                                <span className="ml-2 text-sm font-medium">{loading === 'CONFIRMING' ? 'Đang xác nhận' : 'Xác nhận'}</span>
                                            </button>
                                        )}
                                        {orderStatus === "CONFIRMED" && (
                                            <button
                                                onClick={() => progress(order.id)}
                                                className={`flex items-center ${loading === 'PROCESSING' ? 'text-gray-400' : 'text-purple-600'} hover:text-purple-800 transition duration-200`}
                                                disabled={loading === 'PROCESSING'}
                                            >
                                                {loading === 'PROCESSING' ? <BiLoaderCircle size={20} className="animate-spin" /> : <BiLoaderCircle size={20} />}
                                                <span className="ml-2 text-sm font-medium">{loading === 'PROCESSING' ? 'Đang xử lý' : 'Xử lý'}</span>
                                            </button>
                                        )}
                                        {orderStatus === "PROCESSING" && (
                                            <button
                                                onClick={() => ship(order.id)}
                                                className={`flex items-center ${loading === 'SHIPPING' ? 'text-gray-400' : 'text-orange-600'} hover:text-orange-800 transition duration-200`}
                                                disabled={loading === 'SHIPPING'}
                                            >
                                                {loading === 'SHIPPING' ? <BiLoaderCircle size={20} className="animate-spin" /> : <FaTruck size={20} />}
                                                <span className="ml-2 text-sm font-medium">{loading === 'SHIPPING' ? 'Đang giao hàng' : 'Giao hàng'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p><strong>Địa chỉ:</strong> {order.shipping_address}</p>
                                <p><strong>Phương thức giao:</strong> {order.shipping_method}</p>
                                <p><strong>Phí giao hàng:</strong> {formatPrice(order.shipping_fee)}</p>
                            </div>
                        </div>
                        <p><strong>Tổng hóa đơn:</strong> {formatPrice(order.total_price)}</p>
                    </section>

                    {/* Order Items Section */}
                    <section>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Items</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {order.orderDetails.map((detail) => (
                                    <div key={detail.id} className="border rounded-lg shadow-md p-2 mb-2">
                                        <img
                                            src={detail.book.cover_img_url}
                                            alt={detail.book.title}
                                            className="w-full object-cover rounded-lg mb-1"
                                        />
                                        <div className="space-y-1">
                                            <p className="text-gray-800 font-semibold text-sm">{detail.book.title}</p>
                                            <p className="text-sm"><strong>Giá:</strong> {formatPrice(detail.price)}</p>
                                            <p className="text-sm"><strong>Số lượng:</strong> {detail.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailOrder;
