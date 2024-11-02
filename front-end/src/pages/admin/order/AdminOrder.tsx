import { useEffect, useState } from "react";
import { getAllOrder, updateCartStatus, updateMultipleCartStatus } from "../../../apis/order";
import { PiFileCsvBold } from "react-icons/pi";
// import OrderConfigModal from "../../../components/modals/OrderConfigModal";
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
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Orders per page
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");
  // New sorting state variables
  const [sortField, setSortField] = useState<keyof Order>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");


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
  }, [statusFilter, userIdFilter, orderIdFilter]);
  const addValuetotxtABillIds = (value: string) => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    txtABillIds.value += value + ", ";
  };
  const exportMultipleBillToPdf = () => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    const billIds = txtABillIds.value.split(",").map((id) => parseInt(id.trim()));
    console.log("Bill IDs:", billIds);
    // alert("Exporting multiple bills to PDF: " + billIds);
    showToast("Exporting multiple bills to PDF: " + billIds, "success");
    // Call API to export multiple bills to PDF
  };
  const deleteAlltxtABillIds = () => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    txtABillIds.value = "";
  }
  const addAllIdsToTxtABillIds = () => {
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    // const allBillIds = currentOrders.map((order) => order.id).join(", ");
    // Thêm tất cả vào, nếu có rồi thì bỏ qua
    const allBillIds = currentOrders.map((order) => order.id).filter((id) => !txtABillIds.value.includes(id.toString())).join(", ");
    txtABillIds.value += allBillIds;
  }
  const txtABillIdsCondition = () => {
    const regex = /^[0-9,\s]*$/;
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    console.log("txtABillIds:", txtABillIds);
    if (!regex.test(txtABillIds.value)) {
      txtABillIds.value = txtABillIds.value.replace(/[^0-9,\s]/g, "");
    }
  }
  const confirmOrd = async (orderId: number) => {
    updateCartStatus(orderId.toString(), 'CONFIRMED').then(() => {
      showToast("Đã xác nhận đơn hàng", "success");
      // điều chỉnh trạng thái đơn hàng
      const updatedOrders = filteredOrders.map((order) =>
        order.id === orderId ? { ...order, status: "CONFIRMED" } : order
      );
      setFilteredOrders(updatedOrders);
    }).catch((err) => {
      console.log(err);
      showToast('Có lỗi xảy ra khi xác nhận đơn hàng: ' + err.message, 'error');
    });

  }
  const progress = async (orderId: number) => {
    updateCartStatus(orderId.toString(), 'PROCESSING').then(() => {
      showToast("Đã xử lý đơn hàng", "success");
      // điều chỉnh trạng thái đơn hàng
      const updatedOrders = filteredOrders.map((order) =>
        order.id === orderId ? { ...order, status: "PROCESSING" } : order
      );
      setFilteredOrders(updatedOrders);
    }).catch((err) => {
      console.log(err);
      showToast('Có lỗi xảy ra khi xử lý đơn hàng: ' + err.message, 'error');
    });

  }
  const ship = async (orderId: number) => {
    updateCartStatus(orderId.toString(), 'DELIVERED').then(() => {
      showToast("Đã gửi hàng", "success");
      // điều chỉnh trạng thái đơn hàng
      const updatedOrders = filteredOrders.map((order) =>
        order.id === orderId ? { ...order, status: "DELIVERED" } : order
      );
      setFilteredOrders(updatedOrders);
    }).catch((err) => {
      console.log(err);
      showToast('Có lỗi xảy ra khi gửi hàng: ' + err.message, 'error');
    });
  }
  const handleUpdateMultipleStatus = async () => {
    // lấy thông tin từ txtABillIds
    const txtABillIds = document.getElementById("txtABillIds") as HTMLTextAreaElement;
    const billIds = txtABillIds.value.split(",").map((id) => parseInt(id.trim()));
    console.log("Bill IDs:", billIds);
    // alert("Exporting multiple bills to PDF: " + billIds);
    showToast("Đang xử lý hàng loạt đơn hàng: " + billIds, "success");
    // Call API to export multiple bills to PDF
    updateMultipleCartStatus(billIds).then(() => {
      showToast("Đã xử lý hàng loạt đơn hàng", "success");
      // điều chỉnh trạng thái đơn hàng
      const updatedOrders = filteredOrders.map((order) =>
        billIds.includes(order.id) ? { ...order, status: "DELIVERED" } : order
      );
      setFilteredOrders(updatedOrders);
    }
    ).catch((err) => {
      console.log(err);
      showToast('Có lỗi xảy ra khi xử lý hàng loạt đơn hàng: ' + err.message, 'error');
    });
  }

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
              setStatusFilter(e.target.value);
            }}
            className="px-4 py-2 rounded-md w-2/12"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(ORDER_STATUSES).map(([key, value]) => (
              <option key={key} value={key}>
                {/* {value} */}
                {value === "Pending" && <span className="text-yellow-500"><BiLoaderCircle className="mr-2" />Chờ xác nhận đơn</span>}
                {value === "Confirmed" && <span className="text-orange-500"><GiConfirmed className="mr-2" />Đơn đã xác nhận</span>}
                {value === "Processing" && <span className="text-yellow-400"><FaDropbox className="mr-2" />Đơn hàng đang đóng gói</span>}
                {value === "Shipped" && <span className="text-green-500"><LiaShippingFastSolid className="mr-2" />Đơn hàng vận chuyển thành công</span>}
                {value === "Delivered" && <span className="text-green-600"><LiaShippingFastSolid className="mr-2" />Đơn hàng đang vận chuyển</span>}
                {value === "Cancelled" && <span className="text-yellow-500"><TbBackpackOff className="mr-2" />Đơn hàng bị hủy</span>}
                {value === "Returned" && <span className="text-yellow-500"><TbTruckReturn className="mr-2" />Đơn hàng bị hoàn trả</span>}

              </option>
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
        <label htmlFor="txtABillIds" className="text-white font-bold m-5" >Danh sách MÃ HÓA ĐƠN</label>
        <div className="flex items-center gap-2">

          <textarea name="txtABillIds" id="txtABillIds" className="resize-none w-full h-36 p-3 rounded-xl bg-white/10 text-white focus:outline-none"
            placeholder="Mã hóa đơn cần xử lý (Thêm tay hoặc nhấn chọn hóa đơn có trong bảng)"
            onChange={txtABillIdsCondition}></textarea>

          <div className="grid ">
            <button className="flex items-center px-4 py-2 bg-red-900 text-white rounded-xl mb-2" onClick={deleteAlltxtABillIds}>
              <AiFillDelete className="mr-2" /> Xóa tất cả
            </button>
            <button
              onClick={exportMultipleBillToPdf}
              className="flex items-center px-4 py-2 bg-green-900 text-white rounded-md mb-2 gap-2"
            >
              <FaProjectDiagram className="ease-in-out" /> Xuất PDF
            </button>
          </div>
        </div>
        <div className="flex p-2 gap-3">
          <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-2">
            <BiSelectMultiple className="mr-2" /> Cập nhật trạng thái
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-2" onClick={handleUpdateMultipleStatus}>
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
          <div className="flex gap-2 items-center">
            <h2 className="text-xl font-semibold text-white mb-2">Tổng số đơn hàng: {currentOrders.length + "/" + filteredOrders.length}</h2>
            <button
              onClick={addAllIdsToTxtABillIds}
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-2"
            >
              <PiFileCsvBold className="ease-in-out" /> Thêm tất cả vào Danh sách MÃ HÓA ĐƠN
            </button>
          </div>


          <div className="table-container max-h-[650px] overflow-y-auto rounded-lg border-none shadow-lg">
            <table id="order-table" className="min-w-full bg-gradient-to-r from-violet-800 to-blue-900 text-white">
              <thead className="sticky top-0 bg-gradient-to-b from-yellow-400 to-yellow-600 text-black">
                <tr>
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
                    THỜI GIAN {sortField === "order_date" && (sortDirection === "asc" ? "↑" : "↓")}
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
                  {/* <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("shipping_fee")}
                  >
                    PHÍ VẬN {sortField === "shipping_fee" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th> */}
                  <th
                    className="py-3 px-6 cursor-pointer hover:underline"
                    onClick={() => handleSort("status")}
                  >
                    TRẠNG THÁI {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="py-3 px-6 cursor-pointer"
                  >
                    HÀNH ĐỘNG
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100 hover:text-black" onClick={() => addValuetotxtABillIds(order.id.toString() || "")}>
                    <td className="py-3 px-6">{order.id}</td>
                    <td className="py-3 px-6 hover:underline cursor-pointer" onClick={
                      (event) => {
                        event.stopPropagation();
                        navigate(`/admin/user/${order.user.id}`);
                      }
                    }>{order.user.firstname + " " + order.user.lastname}</td>
                    <td className="py-3 px-6">{formatPrice(order.total_price)}</td>
                    <td className="py-3 px-6">{formatDate(order.order_date)}</td>
                    <td className="py-3 px-6">{formatAddress(order.shipping_address)}</td>
                    <td className="py-3 px-6">
                      {order.shipping_method === "STANDARD" && <span className="text-yellow-500"><FaTruck />Tiêu chuẩn</span>}
                      {order.shipping_method === "EXPRESS" && <span className="text-green-500"><FaTruckFast />Nhanh</span>}

                    </td>
                    {/* <td className="py-3 px-6">{formatPrice(order.shipping_fee)}</td> */}
                    <td className="py-3 px-6">
                      {/* {order.status} */}
                      {/* { case for order status */}
                      {order.status === "PENDING" && <span className="text-yellow-500 flex gap-1 items-center"><BiLoaderCircle className="" />Xác thực...</span>}
                      {order.status === "CONFIRMED" && <span className="text-orange-500 flex gap-1 items-center"><GiConfirmed />Xác nhận đơn...</span>}
                      {order.status === "PROCESSING" && <span className="text-yellow-400 flex gap-1 items-center"><FaDropbox />Đang đóng hàng...</span>}
                      {order.status === "SHIPPED" && <span className="text-green-500 flex gap-1 items-center"><LiaShippingFastSolid />Giao thành công</span>}
                      {order.status === "DELIVERED" && <span className="text-green-600 flex gap-1 items-center"><LiaShippingFastSolid />Vận chuyển...</span>}
                      {order.status === "CANCELLED" && <span className="text-yellow-500 flex gap-1 items-center"><TbBackpackOff />Đã hủy...</span>}
                      {order.status === "RETURNED" && <span className="text-yellow-500 flex gap-1 items-center"><TbTruckReturn />Hoàn trả</span>}

                    </td>
                    <td className="py-3 px-6">
                      <div className="flex gap-1">
                        <BiDetail className="text-yellow-300" size={20} />
                        {order.status === "PENDING" && <span onClick={() => confirmOrd(order.id)} className="text-yellow-500 flex gap-1 items-center ">Xác nhận đơn</span>}
                        {order.status === "CONFIRMED" && <span onClick={() => progress(order.id)} className="text-orange-500 flex gap-1 items-center">Xử lý đơn</span>}
                        {order.status === "PROCESSING" && <span onClick={() => ship(order.id)} className="text-yellow-400 flex gap-1 items-center bg-blue-500 text-center rounded-xl font-bold">Gửi hàng</span>}
                      </div>
                    </td>
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
    </>
  );
};

export default AdminOrder;
