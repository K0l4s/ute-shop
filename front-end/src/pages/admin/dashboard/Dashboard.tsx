import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import { getTop10BooksAPI } from "../../../apis/book";
import { getReportAPI } from "../../../apis/report";

interface Book {
  id: number;
  ISBN: string;
  title: string;
  desc: string;
  price: string;
  salePrice: string;
  year: string;
  stock: number;
  cover_img_url: string;
  publisher_id: number;
  author_id: number;
  category_id: number;
  totalSell: number;
}

interface reportProps {
  totalUsers: number;
  totalOrders: number;
  totalBooks: number;
  monthlyData: {
    month: number;
    totalSold: number;
    revenue: number;
  }[];
}

const Dashboard = () => {
  const [top10Books, setTop10Books] = useState<Book[]>([]);
  const [report, setReport] = useState<reportProps | null>(null); // Khởi tạo `report` là `null` trước khi có dữ liệu

  const getTop10Books = async () => {
    try {
      const res = await getTop10BooksAPI();
      setTop10Books(res.data);
    } catch (err) {
      console.error("Error fetching top 10 books: ", err);
    }
  };

  const getReport = async () => {
    try {
      const res = await getReportAPI(); // Giả sử có API getReport
      setReport(res);
      console.log(res);
    } catch (err) {
      console.error("Error fetching report data: ", err);
    }
  };

  useEffect(() => {
    getTop10Books();
    getReport();
  }, []);

  // Kiểm tra dữ liệu trước khi render
  if (!report) {
    return <div>Loading...</div>; // Hiển thị thông báo loading nếu `report` chưa có dữ liệu
  }

  const chartData = {
    labels: report.monthlyData.map((data) => `Tháng ${data.month}`),
    datasets: [
      {
        label: 'Revenue (VND)',
        data: report.monthlyData.map((data) => data.revenue),
        backgroundColor: ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6'],
      },
    ],
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center">Welcome to Admin Dashboard</h2>
      {/* line */}
      <div className="w-full h-0.5 bg-gray-300 my-4"></div>

      <h1 className="text-xl font-bold">Tổng doanh thu: {report.monthlyData
        .reduce((acc, month) => acc + Number(month.revenue), 0)
        .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} VNĐ</h1>
      <div className="flex">
        <p className="mr-3">Tính từ</p>
        <input type="date" />
        <p className="ml-3 mr-3">đến</p>
        <input type="date" />
      </div>
      <div className="w-full flex flex-cols">

        <div className="w-1/2 p-2">
          <BarChart data={chartData} />
        </div>
        <div className="w-1/2 p-2 grid grid-rows-2 grid-cols-2 text-center">
          <div className="w-11/12 mb-4 bg-blue-200 rounded-xl shadow-xl">
            <h3 className="font-semibold">Tổng số đơn hàng</h3>
            <p className="font-bold text-5xl">{report.totalOrders}</p>
          </div>
          <div className="w-11/12 mb-4 bg-blue-200 rounded-xl shadow-xl">
            <h3 className="font-semibold">Tổng số sản phẩm</h3>
            <p className="font-bold text-5xl">{report.totalBooks}</p>
          </div>
          <div className="w-11/12 bg-blue-200 rounded-xl shadow-xl">
            <h3 className="font-semibold">Tổng số khách hàng</h3>
            <p className="font-bold text-5xl">{report.totalUsers}</p>
          </div>
          <div className="w-11/12 bg-blue-200 rounded-xl shadow-xl">
            <h3 className="font-semibold">Tổng số sách đã bán ra</h3>
            <p className="font-bold text-5xl">{report.monthlyData
              .reduce((acc, month) => acc + Number(month.totalSold), 0)
              .toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-2/3 p-4 shadow-xl rounded-lg bg-white rounded-xl m-2">
          <h3 className="font-semibold">Người dùng mới</h3>
          <ul>
            {/* Render new users here if needed */}
          </ul>
        </div>
        <div className="w-1/3 p-4 shadow-xl rounded-lg bg-white rounded-xl m-2 mr-8">
          <h3 className="font-semibold">Top 10 sản phẩm bán chạy nhất</h3>
          <ul>
            {top10Books.map((book, index) => (
              <li key={book.id} className="flex justify-between items-center">
                <p>{index + 1}. {book.title}</p>
                <p>{book.totalSell || 0}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
