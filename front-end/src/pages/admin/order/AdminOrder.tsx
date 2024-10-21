import { useEffect, useState } from "react";
import { getAllOrder } from "../../../apis/order";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// Các interface không thay đổi
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrder();
        console.log(response);
        setOrders(response);
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

  // const exportTableToPdf = async () => {
  //   const input = document.getElementById("order-table");
  //   if (input) {
  //     const canvas = await html2canvas(input);
  //     const dataURL = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF();
  //     const imgWidth = 190; // Width of the image in PDF
  //     const pageHeight = pdf.internal.pageSize.height;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let heightLeft = imgHeight;

  //     let position = 0;

  //     pdf.addImage(dataURL, "PNG", 10, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(dataURL, "PNG", 10, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     pdf.save("orders.pdf");
  //   }
  // };

  const exportTableToCsv = () => {
    const csvRows: string[] = [];
    // Thêm tiêu đề cột
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
  
    // Thêm dữ liệu từng đơn hàng
    for (const order of orders) {
      csvRows.push([
        order.id,
        order.user_id,
        formatPrice(order.total_price),
        formatDate(order.order_date),
        `"${order.shipping_address.replace(/"/g, '""')}"`, // Bao quanh địa chỉ bằng dấu nháy kép và thay thế dấu nháy kép bên trong
        order.shipping_method,
        formatPrice(order.shipping_fee),
        order.status,
        formatDate(order.updatedAt),
      ].join(","));
    }
  
    // Tạo blob và tạo liên kết tải xuống
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "orders.csv");
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Order Management</h1>
      {/* action button */}
      <div className="flex justify-end mb-4 p-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3">
          Detail View
        </button>
        {/* <button
          onClick={exportTableToPdf}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
        >
          Export to PDF
        </button> */}
        <button
          onClick={exportTableToCsv}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="table-container max-h-[650px] overflow-y-auto"> {/* Thêm max-height và overflow cho cuộn */}
          <table id="order-table" className="min-w-full bg-white shadow-lg rounded-lg">
            <thead className=" text-white sticky top-0 bg-blue-600">
              <tr>
                <th className="py-3 px-6 ">Order ID</th>
                <th className="py-3 px-6">User ID</th>
                <th className="py-3 px-6 sticky ">Total Price</th>
                <th className="py-3 px-6 sticky ">Order Date</th>
                <th className="py-3 px-6 sticky">Address</th>
                <th className="py-3 px-6 sticky">Ship Method</th>
                <th className="py-3 px-6 sticky ">Ship Fee</th>
                <th className="py-3 px-6 sticky ">Status</th>
                <th className="py-3 px-6 sticky">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-blue-100 transition duration-300"
                >
                  <td className="py-3 px-6">{order.id}</td>
                  <td className="py-3 px-6">{order.user_id}</td>
                  <td className="py-3 px-6">{formatPrice(order.total_price)}</td>
                  <td className="py-3 px-6">{formatDate(order.order_date)}</td>
                  <td className="py-3 px-6">{formatAddress(order.shipping_address)}</td>
                  <td className="py-3 px-6">{order.shipping_method}</td>
                  <td className="py-3 px-6">{formatPrice(order.shipping_fee)}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Shipped"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">{formatDate(order.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
