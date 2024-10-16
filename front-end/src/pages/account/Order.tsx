
import { useEffect, useState } from 'react';
import { getOrderByUser } from '../../apis/order';
interface Order {
  bill_id: number;
  id: number;
  order_date: string;
  shipping_address: string;
  shipping_method: string;
  status: string;
  total_price: string;
  updatedAt: string;
  user_id: number;
  voucher_id: number;
}
const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    getOrderByUser().then((res) => {
      console.log(res);
      setOrders(res);
    });
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h2>
      <p>Danh sách đơn hàng của bạn sẽ được hiển thị tại đây.</p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order: Order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.bill_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_date}</td>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total_price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="p-2 bg-blue-500 text-white rounded-md">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default Orders;
