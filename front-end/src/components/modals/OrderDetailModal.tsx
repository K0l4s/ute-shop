import Modal from 'react-modal';
Modal.setAppElement('#root');
interface Order {
    id: number;
    order_date: string;
    shipping_address: string;
    shipping_method: string;
    status: string;
    total_price: string;
    updatedAt: string;
    user_id: number;
    voucher_id: number;
    discount_id: number;
    orderDetails: {
        book: {
            id: number;
            title: string;
            price: string;
        };
        quantity: number;
        price: string;
    }[];
}
interface OrderDetailModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    Order?: Order | null;
}


const formatDateTime = (date: string) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} `;
}
const formatMoney = (money: string) => {
    return money.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onRequestClose, Order }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75"
            className="fixed inset-5 m-0 mt-20 p-0 bg-white z-80" // Make modal full-screen
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
                    <button onClick={onRequestClose} className="text-xl text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Mã đơn hàng</p>
                            <p className="text-lg font-semibold">{Order?.id || "Không có id"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                            <p className="text-lg font-semibold">{formatDateTime(Order?.order_date || "")}</p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <div>
                            <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                            <p className="text-lg font-semibold">{Order?.shipping_address}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phương thức giao hàng</p>
                            <p className="text-lg font-semibold">{Order?.shipping_method}</p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <div>
                            <p className="text-sm text-gray-500">Tình trạng đơn hàng</p>
                            <p className="text-lg font-semibold">{Order?.status}</p>
                        </div>
                        
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Chi tiết đơn hàng</h3>
                        <table className="w-full mt-2">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left">ID</th>
                                    <th className="text-left">Tên sản phẩm</th>
                                    <th className="text-left">Số lượng</th>
                                    <th className="text-left">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Order?.orderDetails.length === 0 && <p>Không có sản phẩm nào.</p>}
                                {Order?.orderDetails.map((orderDetail) => (
                                    <tr key={orderDetail.book.id} className="border-b">
                                        <td>{orderDetail.book.id}</td>
                                        <td>{orderDetail.book.title}</td>
                                        <td>{orderDetail.quantity}</td>
                                        <td>{formatMoney(orderDetail.price)}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <p className="text-sm text-gray-500">Tổng tiền</p>
                            <p className="text-lg font-semibold">{formatMoney(Order?.total_price || "0")}đ</p>
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default OrderDetailModal;
