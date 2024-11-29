import { useEffect, useState } from "react";
import {
  getAllOrder,
  getOrderDetailByOrderId,
  updateCartStatus,
} from "../../../apis/order";
import { PiFileCsvBold } from "react-icons/pi";
import { BsSearch } from "react-icons/bs";
import { BiDetail, BiLoaderCircle, BiPrinter } from "react-icons/bi";
import { FaTruck } from "react-icons/fa";
import { showToast } from "../../../utils/toastUtils";
import { GiConfirmed } from "react-icons/gi";
import './AdminOrder.css';
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { FiDelete } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { clearOrderId } from "../../../redux/reducers/newOrderSlice";
import AdminDetailOrder from "./AdminDetailOrder";

const ORDER_STATUSES = {
  ALL: "Tất cả",
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
};

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

const AdminOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order>({
    id: 0,
    user_id: 0,
    discount_id: null,
    freeship_id: null,
    total_price: "",
    order_date: "",
    shipping_address: "",
    shipping_method: "",
    shipping_fee: "",
    status: "",
    updatedAt: "",
    orderDetails: [],
    user: {
      id: 0,
      firstname: "",
      lastname: "",
    },
  });
  const onCloseDetail = () => {
    setIsOpenDetail(false);
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrder();
        setOrders(response);
        setFilteredOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (date: string) => new Date(date).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  const formatPrice = (price: string) => new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(parseInt(price));

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleFilterChange = () => {
    const filtered = orders.filter(order => {
      const matchesUserId = userIdFilter ? order.user_id.toString() === userIdFilter : true;
      const matchesStatus = statusFilter && statusFilter !== "ALL" ? order.status === statusFilter : true;
      const matchesOrderId = orderIdFilter ? order.id.toString() === orderIdFilter : true;
      return matchesUserId && matchesStatus && matchesOrderId;
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const exportTableToCsv = () => {
    const csvRows = [
      ["Order ID", "User ID", "Total Price", "Order Date", "Address", "Ship Method", "Ship Fee", "Status", "Updated At"].join(",")
    ];

    currentOrders.forEach(order => {
      csvRows.push([
        order.id,
        order.user_id,
        formatPrice(order.total_price),
        formatDate(order.order_date),
        `"${order.shipping_address.replace(/"/g, '""')}"`,
        order.shipping_method,
        formatPrice(order.shipping_fee),
        order.status,
        formatDate(order.updatedAt),
      ].join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    handleFilterChange();
  }, [statusFilter, userIdFilter, orderIdFilter]);


  const updateOrderStatus = async (orderId: number, status: string, successMessage: string) => {
    try {
      await updateCartStatus(orderId.toString(), status);
      showToast(successMessage, "success");
      setFilteredOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
    } catch (err: any) {
      console.log(err);
      showToast(`Có lỗi xảy ra khi ${successMessage.toLowerCase()}: ${err.message}`, 'error');
    }
  };

  const confirmOrd = (orderId: number) => updateOrderStatus(orderId, 'CONFIRMED', "Đã xác nhận đơn hàng");
  const progress = (orderId: number) => updateOrderStatus(orderId, 'PROCESSING', "Đã xử lý đơn hàng");
  const ship = (orderId: number) => updateOrderStatus(orderId, 'DELIVERED', "Đã gửi hàng");

  const handlePrint = () => window.print();

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

  const orderId = useSelector((state: RootState) => state.newOrder.orderId);
  const dispatch = useDispatch();
  const [newOrderList, setNewOrderList] = useState<Order[]>([]);

  useEffect(() => {
    const fetchNewOrder = async () => {
      if (orderId) {
        const newOrder = await getOrderDetailByOrderId(orderId);
        setNewOrderList(prev => [...prev, newOrder]);
        dispatch(clearOrderId());
      }
    };
    fetchNewOrder();
  }, [orderId]);

  const removeOrderFromList = (orderId: number) => {
    setNewOrderList(prev => prev.filter(order => order.id !== orderId));
  };

  const removeAllNewOrder = () => setNewOrderList([]);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Quản lý đơn hàng</h1>

      {/* Search Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm theo Order ID"
            value={orderIdFilter}
            onChange={(e) => setOrderIdFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Tìm theo User ID"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(ORDER_STATUSES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <button
            onClick={handleFilterChange}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <BsSearch className="mr-2" /> Tìm kiếm
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Tổng số đơn hàng: {currentOrders.length}/{filteredOrders.length}
            </h2>
            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 p-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
              >
                {"<"}
              </button>
              <span className="text-gray-600">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
              >
                {">"}
              </button>
              <select
                value={itemsPerPage === orders.length ? 'all' : itemsPerPage}
                onChange={(e) => {
                  const value = e.target.value;
                  setItemsPerPage(value === 'all' ? orders.length : parseInt(value));
                }}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="9">9</option>
                <option value="18">18</option>
                <option value="27">27</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportTableToCsv}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <PiFileCsvBold className="mr-2" /> Xuất CSV
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <BiPrinter className="mr-2" /> In Hóa đơn
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex mb-4 overflow-x-auto bg-white w-full border-gray-400 border rounded-t-lg">
            {Object.keys(ORDER_STATUSES).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 w-full font-semibold ${getStatusClassName(status)} ${statusFilter === status ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200 ' : ''} `}
              >
                {ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]}
              </button>
            ))}
          </div>

          {newOrderList.length > 0 && (
            <>
              <div className="relative">
                <div className="mb-4 text-lg font-bold text-violet-700 text-center">Đơn hàng mới</div>
                <button className="flex items-center bg-red-500 p-2 rounded-full text-white absolute top-0 right-2 mb-3" onClick={removeAllNewOrder}>
                  <FiDelete size={20} />
                  <span className="ml-2 text-sm font-medium">Xóa tất cả đơn hàng mới</span>
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-1 gap-3 px-3">
                {newOrderList.map(order => (
                  <div key={order.id} className="mb-6 p-6 bg-yellow-500 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                      <h3 className="text-xl text-violet-700 font-semibold">ĐƠN HÀNG #{order.id}</h3>
                      <span className={`text-sm font-medium py-1 px-2 rounded-full ${getStatusClassName(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mb-4 text-sm text-gray-700 space-y-2">
                      <p><strong>Khách hàng:</strong> {order.user?.firstname} {order.user?.lastname}</p>
                      <p><strong>Tổng tiền:</strong> {formatPrice(order.total_price)}</p>
                      <p><strong>Ngày đặt:</strong> {formatDate(order.order_date)}</p>
                      <div>
                        <strong>Sách trong đơn hàng:</strong>
                        <ul>
                          {order.orderDetails.map(detail => (
                            <li key={detail.id}>
                              {detail.book.ISBN} -
                              {" " + detail.book.title} - Số lượng: {detail.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>


                    <div className="flex items-center justify-end space-x-3 mt-4">
                      <button onClick={() => { setCurrentOrder(order); setIsOpenDetail(true) }} className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200">
                        <BiDetail size={20} />
                        <span className="ml-2 text-sm font-medium">Chi tiết</span>
                      </button>
                      {order.status === "PENDING" && (
                        <button onClick={() => confirmOrd(order.id)} className="flex items-center text-green-600 hover:text-green-800 transition duration-200">
                          <GiConfirmed size={20} />
                          <span className="ml-2 text-sm font-medium">Xác nhận</span>
                        </button>
                      )}
                      {order.status === "CONFIRMED" && (
                        <button onClick={() => progress(order.id)} className="flex items-center text-purple-600 hover:text-purple-800 transition duration-200">
                          <BiLoaderCircle size={20} />
                          <span className="ml-2 text-sm font-medium">Xử lý</span>
                        </button>
                      )}
                      {order.status === "PROCESSING" && (
                        <button onClick={() => ship(order.id)} className="flex items-center text-orange-600 hover:text-orange-800 transition duration-200">
                          <FaTruck size={20} />
                          <span className="ml-2 text-sm font-medium">Giao hàng</span>
                        </button>
                      )}
                      <button className="flex items-center bg-red-500 p-2 rounded-full text-white" onClick={() => removeOrderFromList(order.id)}>
                        <FiDelete size={20} />
                        <span className="ml-2 text-sm font-medium">Xử lý xong</span>
                      </button>
                    </div>
                  </div>
                ))}</div>
              <div className="w-10/12 h-1 bg-gray-700 rounded-full m-auto mb-5"></div>
            </>
          )}

          <div className="">
            <div id="order-list" className="overflow-x-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-1 gap-3 px-3 print-container">
              {currentOrders.length === 0 ? (
                <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
              ) : (
                currentOrders.map(order => (
                  <div
                    key={order.id}
                    className=
                    {`order-item mb-6 p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl 
                      transition-shadow duration-300 ease-in-out ${getStatusClassName(order.status)}`}
                  >
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                      <h3 className="text-xl text-violet-700 font-semibold">ĐƠN HÀNG #{order.id}</h3>
                      <span className={`text-sm font-medium py-1 px-2 rounded-full ${getStatusClassName(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mb-4 text-sm text-gray-700 space-y-2">
                      <p>
                        <strong>Khách hàng:</strong> {order.user?.firstname} {order.user?.lastname}
                      </p>
                      <p>
                        <strong>Tổng tiền:</strong> {formatPrice(order.total_price)}
                      </p>
                      <p>
                        <strong>Ngày đặt:</strong> {formatDate(order.order_date)}
                      </p>
                      <strong>Sách trong đơn hàng:</strong>
                      <ul>
                        {order.orderDetails.map((detail) => (
                          <li key={detail.id}>
                            {detail.book.ISBN} - {detail.book.title} - Số lượng: {detail.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-end space-x-3 mt-4">
                      <button onClick={() => { setCurrentOrder(order); setIsOpenDetail(true) }} className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200">
                        <BiDetail size={20} />
                        <span className="ml-2 text-sm font-medium">Chi tiết</span>
                      </button>
                      {order.status === "PENDING" && (
                        <button
                          onClick={() => confirmOrd(order.id)}
                          className="flex items-center text-green-600 hover:text-green-800 transition duration-200"
                        >
                          <GiConfirmed size={20} />
                          <span className="ml-2 text-sm font-medium">Xác nhận</span>
                        </button>
                      )}
                      {order.status === "CONFIRMED" && (
                        <button
                          onClick={() => progress(order.id)}
                          className="flex items-center text-purple-600 hover:text-purple-800 transition duration-200"
                        >
                          <BiLoaderCircle size={20} />
                          <span className="ml-2 text-sm font-medium">Xử lý</span>
                        </button>
                      )}
                      {order.status === "PROCESSING" && (
                        <button
                          onClick={() => ship(order.id)}
                          className="flex items-center text-orange-600 hover:text-orange-800 transition duration-200"
                        >
                          <FaTruck size={20} />
                          <span className="ml-2 text-sm font-medium">Giao hàng</span>
                        </button>
                      )}
                    </div>
                  </div>

                ))
              )}

            </div>
            <div className="flex justify-center items-center gap-4 p-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
              >
                {"<"}
              </button>
              <span className="text-gray-600">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
              >
                {">"}
              </button>
              <select
                value={itemsPerPage === orders.length ? 'all' : itemsPerPage}
                onChange={(e) => {
                  const value = e.target.value;
                  setItemsPerPage(value === 'all' ? orders.length : parseInt(value));
                }}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="9">9</option>
                <option value="18">18</option>
                <option value="27">27</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <AdminDetailOrder isOpen={isOpenDetail} closeModal={onCloseDetail} order={currentOrder} updateOrderStatus={updateOrderStatus} />
    </div>
  );
};

export default AdminOrder;
