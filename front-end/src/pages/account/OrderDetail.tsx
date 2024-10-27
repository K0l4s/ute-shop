// OrderDetail.tsx
import { Order } from '../../models/OrderType';
import Modal from 'react-modal';
Modal.setAppElement('#root');
const OrderDetail = ({ order, isOpen, onClose }: { order: Order; onClose: () => void; isOpen: boolean }) => {
    const formatPrice = (price: string) => {
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    const sumPrice = (orderDetails: Order['orderDetails']) => {
        return orderDetails.reduce((acc, detail) => acc + Number(detail.price) * detail.quantity, 0);
    }
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75"
            className="fixed inset-5 m-0 mt-20 p-0 bg-white z-80 overflow-auto" // Make modal full-screen
        >
            <div className="bg-white rounded-lg p-6">
                <button onClick={onClose} className="text-blue-500 mb-4 fixed bg-gray-300 p-2 rounded-xl right-10">&lt; Trở lại</button>
                <h2 className="text-lg font-semibold mb-2 mt-10">Mã đơn hàng: {order.id}</h2>
                <p className="text-red-500">Đơn hàng {order.status}</p>

                {/* Order Status Tracking */}
                <div className="flex items-center space-x-4 my-6">
                    <div className="flex flex-col items-center">
                        <div className="bg-green-500 p-3 rounded-full text-white">✓</div>
                        <p>Đã đặt thành công</p>
                        <span className="text-sm text-gray-600">{order.order_date}</span>
                    </div>
                    <div className="flex-grow border-t border-gray-300"></div>
                    <div className="flex flex-col items-center">
                        <div className={`p-3 rounded-full ${order.status !== 'PENDING' ? 'bg-green-500' : 'bg-gray-300'} text-white`}>✓</div>
                        <p>Đã thanh toán</p>
                        <span className="text-sm text-gray-600">{order.updatedAt}</span>
                    </div>
                    <div className="flex-grow border-t border-gray-300"></div>
                    <div className="flex flex-col items-center">
                        <div className={`p-3 rounded-full ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'} text-white`}>✓</div>
                        <p>Đơn hàng đang giao</p>
                        <span className="text-sm text-gray-600">{order.status === 'SHIPPED' ? order.updatedAt : '???'}</span>
                    </div>
                    <div className="flex-grow border-t border-gray-300"></div>
                    <div className="flex flex-col items-center">
                        <div className={`p-3 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'} text-white`}>✓</div>
                        <p>Đã nhận được hàng</p>
                        <span className="text-sm text-gray-600">{order.status === 'DELIVERED' ? order.updatedAt : '???'}</span>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="border p-4 rounded mb-4 bg-white">
                    <h3 className="font-semibold">Địa chỉ nhận hàng</h3>
                    <p>Ngô Minh Thuận</p>
                    <p>(+84) 000000000</p>
                    <p>28/6 đường Lê Văn Chí, Phường Linh Chiểu, Thành Phố Thủ Đức, TP. Hồ Chí Minh</p>
                </div>

                {/* Order Items */}
                <div className="border p-4 rounded mb-4 bg-white">
                    <h3 className="font-semibold mb-2">Sản phẩm</h3>
                    {order.orderDetails.map((detail) => (
                        <div key={detail.book.id} className="flex mb-4 p-2 bg-gray-50 rounded">
                            <img src={detail.book.cover_img_url} alt={detail.book.title} className="w-16 h-20 mr-4 object-cover rounded" />
                            <div className="flex-1">
                                <h4 className="text-base font-semibold">{detail.book.title}</h4>
                                <p className="text-sm text-gray-600">Phân loại: {detail.book.category}</p>
                                <p className="text-sm text-gray-600">Số lượng: {detail.quantity}</p>
                                <p className="text-lg font-semibold text-red-500">{formatPrice(detail.price)} đ</p>
                                <p className="text-sm line-through text-gray-400">{formatPrice(detail.book.price)} đ</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="border p-4 rounded bg-white">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="py-1">Tổng tiền</td>
                                <td className="text-right">{formatPrice(
                                    // sum theo orderDetails.Book * orderDetails.quantity
                                    formatPrice(sumPrice(order.orderDetails).toString())
                                )} đ</td>
                            </tr>
                            <tr>
                                <td className="py-1">Phí vận chuyển</td>
                                <td className="text-right">20,000 đ</td>
                            </tr>
                            <tr>
                                <td className="py-1">Voucher freeship</td>
                                <td className="text-right text-red-500">-20,000 đ</td>
                            </tr>
                            <tr>
                                <td className="py-1">Voucher giảm giá</td>
                                <td className="text-right text-red-500">-0 đ</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-semibold">Thành tiền</td>
                                <td className="text-right font-semibold text-red-500">{formatPrice((sumPrice(order.orderDetails) + 20000 - 20000).toString())} đ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
};

export default OrderDetail;
