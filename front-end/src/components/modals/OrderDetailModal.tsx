import Modal from 'react-modal';
Modal.setAppElement('#root');
interface OrderDetailModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}
interface Order {
    // bill_id: number;
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
    order_detail: {
      book:{
        id:number,
        title: string;
        price: string;
      }
      quantity: number;
      price: string;
    }[];
}
const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onRequestClose }) => {
    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white rounded shadow-lg"
            >


            </Modal>
        </div>
    )
}

export default OrderDetailModal