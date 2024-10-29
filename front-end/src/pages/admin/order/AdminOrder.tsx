import { useEffect, useState } from "react";
import { getAllOrder } from "../../../apis/order";
import { PiFileCsvBold } from "react-icons/pi";
import OrderConfigModal from "../../../components/modals/OrderConfigModal";
import { BsSearch } from "react-icons/bs";
import { BiSelectMultiple } from "react-icons/bi";

const ORDER_STATUSES = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
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
}

const AdminOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Orders per page
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");
  // New sorting state variables
  const [sortField, setSortField] = useState<keyof Order>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrder();
        setOrders(response);
        setFilteredOrders(response); // Set initial filtered orders
        console.log("Fetched orders:", response); // Kiểm tra dữ liệu ở đây
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const formatAddress = (address: string) => {
    return address.length > 20 ? address.slice(0, 20) + "..." : address;
  };

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

  // Filter orders based on user ID and status
  const handleFilterChange = () => {
    // console.log("Current status filter:", statusFilter); // Kiểm tra giá trị filter
    const filtered = orders.filter(order => {
      const matchesUserId = userIdFilter ? order.user_id.toString() === userIdFilter : true;
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      const matchesOrderId = orderIdFilter ? order.id.toString() === orderIdFilter : true;
      return matchesUserId && matchesStatus && matchesOrderId;
    });
    console.log("Filtered orders:", statusFilter); // Kiểm tra kết quả filter
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Sort orders based on selected field and direction
  const handleSort = (field: keyof Order) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return direction === "asc" ? (aValue as any) - (bValue as any) : (bValue as any) - (aValue as any);
    });

    setFilteredOrders(sortedOrders);
  };

  // Export orders to CSV
  const exportTableToCsv = () => {
    const csvRows: string[] = [];
    csvRows.push([
      "Order ID",
      "User ID",
      "Total Price",
      "Order Date",
      "Address",
      "Ship Method",
      "Ship Fee",
      "Status",
      "Updated At",
    ].join(","));

    for (const order of filteredOrders) {
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
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "orders.csv");
    a.click();
    window.URL.revokeObjectURL(url);
  };
  useEffect(() => {
    handleFilterChange();
  }, [statusFilter, userIdFilter,orderIdFilter]);
  return (
    <>
      <div className="p-6 min-h-screen from-blue-500 to-purple-600">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Quản lý đơn hàng</h1>
        <div className="flex items-center mb-4 p-2 gap-3">
        <input
            type="text"
            placeholder="Tìm theo User ID"
            value={orderIdFilter}
            onChange={(e) => {
              setOrderIdFilter(e.target.value);
              // handleFilterChange();
            }}
            className="px-4 py-2 rounded-md w-4/12"
          />
          <input
            type="text"
            placeholder="Tìm theo User ID"
            value={userIdFilter}
            onChange={(e) => {
              setUserIdFilter(e.target.value);
              // handleFilterChange();
            }}
            className="px-4 py-2 rounded-md w-4/12"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              // setStatusFilter(e.target.value);
              // setStatus theo giá trị của ORDER_STATUSES
              setStatusFilter(e.target.value);
              // handleFilterChange();
              // console.log("Updated status filter:", e.target.value); // Kiểm tra giá trị khi thay đổi
            }}
            className="px-4 py-2 rounded-md w-2/12"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(ORDER_STATUSES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <button
            onClick={handleFilterChange}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md w-2/12"
          >
            <BsSearch className="mr-2" /> Tìm kiếm
          </button>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Thao tác</h2>
        <div className="flex p-2 gap-3">
        <button onClick={openModal} className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-2">
            <BiSelectMultiple className="mr-2" /> Cập nhật trạng thái
          </button>
          <button onClick={openModal} className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-2">
            <BiSelectMultiple className="mr-2" /> Xử lý hàng loạt
          </button>
          <button
            onClick={exportTableToCsv}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-2"
          >
            <PiFileCsvBold className="ease-in-out" /> Xuất file CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold text-white mb-2">Tổng số đơn hàng: {filteredOrders.length}</h2>
          <div className="table-container max-h-[650px] overflow-y-auto rounded-lg border-none shadow-lg">
            <table id="order-table" className="min-w-full bg-gradient-to-r from-violet-800 to-blue-900 text-white">
              <thead className="sticky top-0 bg-gradient-to-b from-yellow-400 to-yellow-600 text-black">
                <tr>
                  {/* {["id", "user_id", "total_price", "order_date", "shipping_address", "shipping_method", "shipping_fee", "status"].map((header) => (
                    <th
                      key={header}
                      className="py-3 px-6 cursor-pointer hover:underline"
                      onClick={() => handleSort(header as keyof Order)}
                    >
                      {header.replace(/_/g, " ").toUpperCase()} {sortField === header && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                  ))} */}
                  <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("id")}
                  >
                    MÃ ĐƠN {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("user_id")}
                  >
                    KHÁCH {sortField === "user_id" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("total_price")}
                  >
                    THÀNH TIỀN {sortField === "total_price" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("order_date")}
                  >
                    NGÀY ĐẶT {sortField === "order_date" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>

                  <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("shipping_address")}
                  >
                    ĐỊA CHỈ {sortField === "shipping_address" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("shipping_method")}
                  >
                    VẬN CHUYỂN {sortField === "shipping_method" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("shipping_fee")}
                  >
                    PHÍ VẬN {sortField === "shipping_fee" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("status")}
                  >
                   TRẠNG THÁI {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100 hover:text-black">
                    <td className="py-3 px-6">{order.id}</td>
                    <td className="py-3 px-6">{order.user_id}</td>
                    <td className="py-3 px-6">{formatPrice(order.total_price)}</td>
                    <td className="py-3 px-6">{formatDate(order.order_date)}</td>
                    <td className="py-3 px-6">{formatAddress(order.shipping_address)}</td>
                    <td className="py-3 px-6">{order.shipping_method}</td>
                    <td className="py-3 px-6">{formatPrice(order.shipping_fee)}</td>
                    <td className="py-3 px-6">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="mx-2 px-4 py-2 bg-gray-800 text-white rounded-md"
          >
            Trang trước
          </button>
          <span className="text-white">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="mx-2 px-4 py-2 bg-gray-800 text-white rounded-md"
          >
            Trang sau
          </button>
        </div>
      </div>

      {/* <OrderConfigModal isOpen={isModalOpen} closeModal={closeModal} /> */}
    </>
  );
};

export default AdminOrder;
