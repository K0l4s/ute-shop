import { useEffect, useState } from 'react';
import { getOrderByUser } from '../../apis/order';
import OrderDetailModal from '../../components/modals/OrderDetailModal';
// import { BsViewList } from 'react-icons/bs';
import { TiEye } from 'react-icons/ti';
import { RiDeleteBin3Fill } from 'react-icons/ri';

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
  freeship_id: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortField, setSortField] = useState<string>(''); // Trường được chọn để sắp xếp
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Thứ tự sắp xếp: asc hoặc desc
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  useEffect(() => {
    getOrderByUser().then((res) => {
      console.log(res);
      setOrders(res);
    });
  }, []);

  const formatDateTime = (date: string) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatPrice = (price: string) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDescription = (description: string) => {
    return description.length > 10 ? description.slice(0, 10) + '...' : description;
  };

  // Hàm sắp xếp dữ liệu dựa trên trường và thứ tự
  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0; // Nếu chưa chọn trường nào thì không sắp xếp
    let fieldA = a[sortField as keyof Order];
    let fieldB = b[sortField as keyof Order];

    if (typeof fieldA === 'string') {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toString();
    }

    if (sortOrder === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleOpenDetail = (key: number) => {
    const orderToShow = orders[key];
    setSelectedOrder(orderToShow);
    console.log("Selected Order:", orderToShow); // Kiểm tra giá trị của đơn hàng được chọn
    setIsOpenDetail(true); // Mở modal
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h2>
        {orders.length === 0 && <p>Không có đơn hàng nào.</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                  ID {sortField === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('order_date')}>
                  Order Time {sortField === 'order_date' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('total_price')}>
                  Total Price {sortField === 'total_price' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' onClick={() => handleSort('shipping_address')}>
                  Address {sortField === 'shipping_address' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' onClick={() => handleSort('shipping_method')}>
                  Shipping Method {sortField === 'shipping_method' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedOrders.map((order: Order, index) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(order.order_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(order.total_price)} vnđ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDescription(order.shipping_address)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.shipping_method === 'STANDARD'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.shipping_method === 'EXPRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : ''
                        }`}
                    >
                      {order.shipping_method}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : ''
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="p-2 bg-blue-500 text-white rounded-md mr-2" onClick={() => handleOpenDetail(index)}><TiEye /></button>
                    {order.status === 'PENDING' && new Date().getTime() - new Date(order.order_date).getTime() < 30 * 60 * 1000 && (
                      <button className="p-2 bg-red-500 text-white rounded-md"><RiDeleteBin3Fill /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <OrderDetailModal isOpen={isOpenDetail} onRequestClose={() => setIsOpenDetail(false)} Order={selectedOrder} />
    </>
  );
};

export default Orders;
