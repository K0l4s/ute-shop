import { useEffect, useState } from "react";
import { getTop10BooksAPI } from "../../../apis/book";
import { getReportAPI } from "../../../apis/report";
import LineChart from "./LineChart";
import useIntersectionObserver from "../../../hook/useIntersectionObserver";

interface Book {
  id: number;
  title: string;
  totalSell: number;
}

interface MonthlyData {
  month: number;
  totalSold: number;
  revenue: number;
}

interface User {
  id: number;
  avatar_url: string;
  createAt: string;
  firstname: string;
  lastname: string;
}

interface ReportProps {
  totalUsers: number;
  totalOrders: number;
  totalBooks: number;
  monthlyData: MonthlyData[];
  newUsers: User[];
}

const Dashboard = () => {
  const { isVisible: isTotalUsersVisible, elementRef: totalUsersRef } = useIntersectionObserver();
  const { isVisible: isRevenueVisible, elementRef: revenueRef } = useIntersectionObserver();
  const { isVisible: isOrdersVisible, elementRef: ordersRef } = useIntersectionObserver();
  const { isVisible: isBooksVisible, elementRef: booksRef } = useIntersectionObserver();
  const { isVisible: isSoldBooksVisible, elementRef: soldBooksRef } = useIntersectionObserver();

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
        backgroundColor: "linear-gradient(90deg, #3B82F6, #10B981)", // Gradient cho biểu đồ
      },
    ],
  };

  const totalRevenue = report.monthlyData
    .reduce((acc, month) => acc + Number(month.revenue || 0), 0)
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const totalSoldBooks = report.monthlyData
    .reduce((acc, month) => acc + Number(month.totalSold || 0), 0)
    .toLocaleString();
  const formatDateTime = (date: string) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }
  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold text-center text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-6 min-h-[120px]">
        <div
          ref={totalUsersRef}
          className={`bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-lg text-center shadow-lg flex flex-col items-center justify-center transition-opacity duration-700 ${
            isTotalUsersVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="font-semibold text-white">Total Users</h3>
          <p className="text-4xl font-bold text-white">{report.totalUsers}</p>
        </div>

        <div
          ref={revenueRef}
          className={`bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-lg text-center shadow-lg flex flex-col items-center justify-center transition-opacity duration-700 ${
            isRevenueVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="font-semibold text-white">Total Revenue</h3>
          <p className="text-4xl font-bold text-white">{totalRevenue}</p>
        </div>

        <div
          ref={ordersRef}
          className={`bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-lg text-center shadow-lg flex flex-col items-center justify-center transition-opacity duration-700 ${
            isOrdersVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="font-semibold text-white">Total Orders</h3>
          <p className="text-4xl font-bold text-white">{report.totalOrders}</p>
        </div>

        <div
          ref={booksRef}
          className={`bg-gradient-to-r from-purple-500 to-purple-700 p-4 rounded-lg text-center shadow-lg flex flex-col items-center justify-center transition-opacity duration-700 ${
            isBooksVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="font-semibold text-white">Total Books</h3>
          <p className="text-4xl font-bold text-white">{report.totalBooks}</p>
        </div>

        <div
          ref={soldBooksRef}
          className={`bg-gradient-to-r from-pink-400 to-pink-600 p-4 rounded-lg text-center shadow-lg flex flex-col items-center justify-center transition-opacity duration-700 ${
            isSoldBooksVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="font-semibold text-white">Total Sold Books</h3>
          <p className="text-4xl font-bold text-white">{totalSoldBooks}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/3 p-4">
          <LineChart data={chartData} />
        </div>
        <div className="lg:w-1/3 p-4">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-4 mb-4 text-black">
            <h3 className="font-semibold text-center">Top 10 Bestselling Books</h3>
            <ul className="mt-4 space-y-2">
              {top10Books.map((book, index) => (
                <li
                  key={book.id}
                  className="flex justify-between cursor-pointer 
                           transition-colors 
                           hover:text-white
                           duration-300
                           ease-in-out
                           hover:font-bold hover:bg-gradient-to-r 
                           hover:from-yellow-900 hover:to-transparent p-2 rounded-full"
                >
                  <span>{index + 1}. {book.title}</span>
                  <span>{book.totalSell || 0}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white">New Users</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {report.newUsers.map((user) => (
            <li key={user.id} className="flex items-center bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 shadow-md text-white">
              <img
                src={user.avatar_url || "default-avatar-url"}
                alt="avatar"
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <p className="font-medium">{user.firstname} {user.lastname}</p>
                <p className="text-gray-200 text-sm">Joined: {formatDateTime(user.createAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
