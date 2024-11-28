import { useEffect, useState } from "react";
import { getAllOrder, updateCartStatus, updateMultipleCartStatus } from "../../../apis/order";
import { PiFileCsvBold } from "react-icons/pi";
import { BsSearch } from "react-icons/bs";
import { BiDetail, BiLoaderCircle, BiPrinter, BiSelectMultiple } from "react-icons/bi";
import { FaProjectDiagram, FaTruck } from "react-icons/fa";
import { showToast } from "../../../utils/toastUtils";
import { AiFillDelete } from "react-icons/ai";
import { GiConfirmed } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../../components/tooltip/Tooltip";
import './AdminOrder.css'
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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

  const exportPDF = () => {
    const element = document.getElementById('order-list'); // ID của phần tử muốn xuất PDF

    if (element) {
      html2canvas(element).then((canvas) => {
        const doc = new jsPDF();
        const imgData = canvas.toDataURL("image/png");

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const aspectRatio = imgWidth / imgHeight;

        // Tính toán chiều rộng và chiều cao sao cho ảnh vừa với trang PDF
        let scaledWidth = pageWidth;
        let scaledHeight = pageWidth / aspectRatio;

        // Nếu chiều cao ảnh lớn hơn chiều cao trang, điều chỉnh lại chiều cao và chiều rộng sao cho vừa
        if (scaledHeight > pageHeight) {
          scaledHeight = pageHeight;
          scaledWidth = pageHeight * aspectRatio;
        }

        let yOffset = 0; // Khởi tạo offset cho phần tử đầu tiên

        // Thêm ảnh vào PDF và điều chỉnh độ dài của mỗi phần tử sao cho hợp lý với chiều cao của trang
        while (yOffset < imgHeight) {
          if (yOffset > 0) {
            doc.addPage(); // Thêm trang mới khi cần thiết
          }

          doc.addImage(imgData, 'PNG', 0, yOffset, scaledWidth, scaledHeight);
          yOffset += pageHeight; // Cập nhật offset sau khi vẽ ảnh vào trang
        }

        doc.save("orders.pdf"); // Lưu PDF
      });
    }
  };



  useEffect(() => {
    handleFilterChange();
  }, [statusFilter, userIdFilter, orderIdFilter]);

  const addAllIdsToTxtABillIds = () => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    const allBillIds = currentOrders
      .map(order => order.id)
      .filter(id => !txtABillIds.value.includes(id.toString()))
      .join(", ");
    txtABillIds.value += allBillIds;
  };

  const confirmOrd = async (orderId: number) => {
    try {
      await updateCartStatus(orderId.toString(), 'CONFIRMED');
      showToast("Đã xác nhận đơn hàng", "success");
      setFilteredOrders(prev =>
        prev.map(order => order.id === orderId ? { ...order, status: "CONFIRMED" } : order)
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
        prev.map(order => order.id === orderId ? { ...order, status: "PROCESSING" } : order)
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
        prev.map(order => order.id === orderId ? { ...order, status: "DELIVERED" } : order)
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
        prev.map(order => billIds.includes(order.id) ? { ...order, status: "DELIVERED" } : order)
      );
    } catch (err: any) {
      console.log(err);
      showToast('Có lỗi xảy ra khi xử lý hàng loạt đơn hàng: ' + err.message, 'error');
    }
  }; const handlePrint = () => {
    window.print();  // Gọi trình in của trình duyệt
  };

  const getStatusClassName = (status: any) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'RETURNED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-200 text-gray-600';
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
      <div className="flex space-x-2 mb-4 overflow-x-auto bg-white justify-around border-gray-400 border rounded-t-lg">
        <button onClick={() => setStatusFilter('ALL')} className={`px-4 py-2 font-semibold ${statusFilter === 'ALL' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Tất cả</button>
        <button onClick={() => setStatusFilter('PENDING')} className={`px-4 py-2 font-semibold ${statusFilter === 'PENDING' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đang chờ</button>
        <button onClick={() => setStatusFilter('CONFIRMED')} className={`px-4 py-2 font-semibold ${statusFilter === 'CONFIRMED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đã xác nhận</button>
        <button onClick={() => setStatusFilter('PROCESSING')} className={`px-4 py-2 font-semibold ${statusFilter === 'PROCESSING' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đang xử lý</button>
        <button onClick={() => setStatusFilter('DELIVERED')} className={`px-4 py-2 font-semibold ${statusFilter === 'DELIVERED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đang giao hàng</button>
        <button onClick={() => setStatusFilter('SHIPPED')} className={`px-4 py-2 font-semibold ${statusFilter === 'SHIPPED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đã nhận hàng</button>
        <button onClick={() => setStatusFilter('CANCELLED')} className={`px-4 py-2 font-semibold ${statusFilter === 'CANCELLED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đã hủy</button>
        <button onClick={() => setStatusFilter('RETURNED')} className={`px-4 py-2 font-semibold ${statusFilter === 'RETURNED' ? 'text-violet-700 border-b-4 border-violet-700 transition duration-200' : ''}`}>Đã trả hàng</button>
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
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <BiPrinter className="mr-2" /> In Hóa đơn
              </button>
            </div>
          </div>
        </div>

        <div>
          <div id="order-list" className="print-container">
            {/* Your orders rendering here */}
            <div className="overflow-x-auto">
              {currentOrders.length === 0 ? (
                <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
              ) : (
                <div>
                  {currentOrders.map(order => (
                    <div key={order.id} className="mb-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out">
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
                      </div>

                      <div className="flex items-center justify-end space-x-3 mt-4">
                        <button onClick={() => navigate(`/admin/order/${order.id}`)} className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200">
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
