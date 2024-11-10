import { useEffect, useState } from "react";
import { getAllOrder, updateCartStatus, updateMultipleCartStatus } from "../../../apis/order";
import { PiFileCsvBold } from "react-icons/pi";
import { BsSearch } from "react-icons/bs";
import { BiDetail, BiLoaderCircle, BiSelectMultiple } from "react-icons/bi";
import { FaDropbox, FaProjectDiagram, FaTruck } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { showToast } from "../../../utils/toastUtils";
import { AiFillDelete } from "react-icons/ai";
import { LiaShippingFastSolid } from "react-icons/lia";
import { GiConfirmed } from "react-icons/gi";
import { TbBackpackOff, TbTruckReturn } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../../components/tooltip/Tooltip";

const ORDER_STATUSES = {
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
  }
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
    id: number,
    firstname: string;
    lastname: string;
  };
}

const AdminOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Order>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  const formatAddress = (address: string) => address.length > 20 ? address.slice(0, 20) + "..." : address;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseInt(price));
  };

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleFilterChange = () => {
    const filtered = orders.filter(order => {
      const matchesUserId = userIdFilter ? order.user_id.toString() === userIdFilter : true;
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      const matchesOrderId = orderIdFilter ? order.id.toString() === orderIdFilter : true;
      return matchesUserId && matchesStatus && matchesOrderId;
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field: keyof Order) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return direction === "asc" ? (aValue as any) - (bValue as any) : (bValue as any) - (aValue as any);
    });

    setFilteredOrders(sortedOrders);
  };

  const exportTableToCsv = () => {
    const csvRows = [
      ["Order ID", "User ID", "Total Price", "Order Date", "Address", "Ship Method", "Ship Fee", "Status", "Updated At"].join(",")
    ];

    filteredOrders.forEach(order => {
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

  const addValuetotxtABillIds = (value: string) => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    txtABillIds.value += value + ", ";
  };

  const exportMultipleBillToPdf = () => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    const billIds = txtABillIds.value.split(",").map(id => parseInt(id.trim()));
    showToast("Exporting multiple bills to PDF: " + billIds, "success");
  };

  const deleteAlltxtABillIds = () => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    txtABillIds.value = "";
  };

  const addAllIdsToTxtABillIds = () => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    const allBillIds = currentOrders
      .map(order => order.id)
      .filter(id => !txtABillIds.value.includes(id.toString()))
      .join(", ");
    txtABillIds.value += allBillIds;
  };

  const txtABillIdsCondition = () => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    txtABillIds.value = txtABillIds.value.replace(/[^0-9,\s]/g, "");
  };

  const confirmOrd = async (orderId: number) => {
    try {
      await updateCartStatus(orderId.toString(), 'CONFIRMED');
      showToast("Đã xác nhận đơn hàng", "success");
      setFilteredOrders(prev => 
        prev.map(order => order.id === orderId ? {...order, status: "CONFIRMED"} : order)
      );
    } catch (err: any) {
      console.log(err);
      showToast('Có lỗi xảy ra khi xác nhận đơn hàng: ' + err.message, 'error');
    }
  };

  const progress = async (orderId: number) => {
    try {
      await updateCartStatus(orderId.toString(), 'PROCESSING');
      showToast("Đã xử lý đơn hàng", "success");
      setFilteredOrders(prev =>
        prev.map(order => order.id === orderId ? {...order, status: "PROCESSING"} : order)
      );
    } catch (err: any) {
      console.log(err);
      showToast('Có lỗi xảy ra khi xử lý đơn hàng: ' + err.message, 'error');
    }
  };

  const ship = async (orderId: number) => {
    try {
      await updateCartStatus(orderId.toString(), 'DELIVERED');
      showToast("Đã gửi hàng", "success");
      setFilteredOrders(prev =>
        prev.map(order => order.id === orderId ? {...order, status: "DELIVERED"} : order)
      );
    } catch (err: any) {
      console.log(err);
      showToast('Có lỗi xảy ra khi gửi hàng: ' + err.message, 'error');
    }
  };

  const handleUpdateMultipleStatus = async () => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    const billIds = txtABillIds.value.split(",").map(id => parseInt(id.trim()));
    
    try {
      await updateMultipleCartStatus(billIds);
      showToast("Đã xử lý hàng loạt đơn hàng", "success");
      setFilteredOrders(prev =>
        prev.map(order => billIds.includes(order.id) ? {...order, status: "DELIVERED"} : order)
      );
    } catch (err: any) {
      console.log(err);
      showToast('Có lỗi xảy ra khi xử lý hàng loạt đơn hàng: ' + err.message, 'error');
    }
  };

  return (
    <div className="p-6 min-h-screen ">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 text-white">Quản lý đơn hàng</h1>
      
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
            <option value="">Tất cả trạng thái</option>
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

      {/* Batch Operations */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Thao tác hàng loạt</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <textarea
              id="txtABillIds"
              className="w-full h-36 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mã hóa đơn cần xử lý (Thêm tay hoặc nhấn chọn hóa đơn có trong bảng)"
              onChange={txtABillIdsCondition}
            />
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={deleteAlltxtABillIds}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <AiFillDelete className="mr-2" /> Xóa tất cả
            </button>
            <button
              onClick={exportMultipleBillToPdf}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FaProjectDiagram className="mr-2" /> Xuất PDF
            </button>
            <button
              onClick={handleUpdateMultipleStatus}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <BiSelectMultiple className="mr-2" /> Xử lý hàng loạt
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Tổng số đơn hàng: {currentOrders.length}/{filteredOrders.length}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={addAllIdsToTxtABillIds}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <BiSelectMultiple className="mr-2" /> Chọn tất cả
              </button>
              <button
                onClick={exportTableToCsv}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <PiFileCsvBold className="mr-2" /> Xuất CSV
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => handleSort('id')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th onClick={() => handleSort('total_price')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Tổng tiền</th>
                <th onClick={() => handleSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Trạng thái</th>
                <th onClick={() => handleSort('order_date')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Ngày đặt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr 
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => addValuetotxtABillIds(order.id.toString())}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user?.firstname} {order.user?.lastname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(order.total_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${order.status === ORDER_STATUSES.PENDING ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === ORDER_STATUSES.CONFIRMED ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === ORDER_STATUSES.PROCESSING ? 'bg-purple-100 text-purple-800' : ''}
                      ${order.status === ORDER_STATUSES.SHIPPED ? 'bg-indigo-100 text-indigo-800' : ''}
                      ${order.status === ORDER_STATUSES.DELIVERED ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === ORDER_STATUSES.CANCELLED ? 'bg-red-100 text-red-800' : ''}
                      ${order.status === ORDER_STATUSES.RETURNED ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(order.order_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Tooltip content="Chi tiết">
                        <button onClick={() => navigate(`/admin/order/${order.id}`)} className="text-blue-600 hover:text-blue-800">
                          <BiDetail size={20} />
                        </button>
                      </Tooltip>
                      {order.status === "PENDING" && (
                        <Tooltip content="Xác nhận">
                          <button onClick={() => confirmOrd(order.id)} className="text-green-600 hover:text-green-800">
                            <GiConfirmed size={20} />
                          </button>
                        </Tooltip>
                      )}
                      {order.status === "CONFIRMED" && (
                        <Tooltip content="Xử lý">
                          <button onClick={() => progress(order.id)} className="text-purple-600 hover:text-purple-800">
                            <BiLoaderCircle size={20} />
                          </button>
                        </Tooltip>
                      )}
                      {order.status === "PROCESSING" && (
                        <Tooltip content="Giao hàng">
                          <button onClick={() => ship(order.id)} className="text-orange-600 hover:text-orange-800">
                            <FaTruck size={20} />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 p-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
          >
            Trang trước
          </button>
          <span className="text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
