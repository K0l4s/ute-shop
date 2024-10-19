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

interface MonthlyData {
  month: number;
  totalSold: number;
  revenue: number;
}

interface ReportProps {
  totalUsers: number;
  totalOrders: number;
  totalBooks: number;
  monthlyData: MonthlyData[];
  newUsers: {
    avatar_url: string;
    createAt: string;
    firstname: string;
    lastname: string;
    id: number;
  }[];
}

const Dashboard = () => {
  const [top10Books, setTop10Books] = useState<Book[]>([]);
  const [report, setReport] = useState<ReportProps>({
    totalUsers: 0,
    totalOrders: 0,
    totalBooks: 0,
    monthlyData: [],
    newUsers: [],
  });

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
      const res = await getReportAPI();
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

  const chartData = {
    labels: report.monthlyData.map((data) => `Tháng ${data.month}`) || [],
    datasets: [
      {
        label: "Revenue (VND)",
        data: report.monthlyData.map((data) => data.revenue) || [],
        backgroundColor: [
          "#3B82F6",
          "#EF4444",
          "#F59E0B",
          "#10B981",
          "#6366F1",
          "#8B5CF6",
        ],
      },
    ],
  };

  // Tính tổng doanh thu
  const totalRevenue = report.monthlyData.reduce(
    (acc, month) => acc + Number(month.revenue || 0),
    0
  ).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Tính tổng số sách đã bán ra
  const totalSoldBooks = report.monthlyData.reduce(
    (acc, month) => acc + Number(month.totalSold || 0),
    0
  ).toLocaleString();

  return (
    <>
      <h2 className="text-2xl font-semibold text-center">
        Welcome to Admin Dashboard
      </h2>
      <div className="w-full h-0.5 bg-gray-300 my-4"></div>

      <h1 className="text-xl font-bold">Tổng doanh thu: {totalRevenue}</h1>
      <div className="flex flex-col sm:flex-row mb-4">
        <p className="mr-3">Tính từ</p>
        <input type="date" className="border rounded p-1" />
        <p className="ml-3 mr-3">đến</p>
        <input type="date" className="border rounded p-1" />
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-2">
          <BarChart data={chartData} />
        </div>
        <div className="w-full lg:w-1/2 p-2 grid grid-cols-1 sm:grid-cols-2 text-center gap-4">
          <div className="bg-blue-200 rounded-xl shadow-xl p-4">
            <h3 className="font-semibold">Tổng số đơn hàng</h3>
            <p className="font-bold text-5xl">{report.totalOrders}</p>
          </div>
          <div className="bg-blue-200 rounded-xl shadow-xl p-4">
            <h3 className="font-semibold">Tổng số sản phẩm</h3>
            <p className="font-bold text-5xl">{report.totalBooks}</p>
          </div>
          <div className="bg-blue-200 rounded-xl shadow-xl p-4">
            <h3 className="font-semibold">Tổng số khách hàng</h3>
            <p className="font-bold text-5xl">{report.totalUsers}</p>
          </div>
          <div className="bg-blue-200 rounded-xl shadow-xl p-4">
            <h3 className="font-semibold">Tổng số sách đã bán ra</h3>
            <p className="font-bold text-5xl">{totalSoldBooks}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 p-4 shadow-xl rounded-lg bg-white m-2">
          <h3 className="font-semibold">Người dùng mới</h3>
          <ul className="mt-5">
            {report.newUsers.map((user) => (
              <li key={user.id} className="flex items-center mb-2">
                <img
                  src={
                    user.avatar_url ||
                    "https://cdn.tuoitre.vn/zoom/700_525/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756-crop-15572850428231644565436.jpg"
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <p className="ml-2">
                  {user.firstname} {user.lastname}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full lg:w-1/3 p-4 shadow-xl rounded-lg bg-white m-2">
          <h3 className="font-semibold">Top 10 sản phẩm bán chạy nhất</h3>
          <ul>
            {top10Books.map((book, index) => (
              <li key={book.id} className="flex justify-between items-center">
                <p>
                  {index + 1}. {book.title}
                </p>
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
