import { useEffect, useState } from "react";
import { getTop10BooksAPI } from "../../../apis/book";
import { getReportAPI } from "../../../apis/report";
import LineChart from "./LineChart";
import useIntersectionObserver from "../../../hook/useIntersectionObserver";
import PieChart from "./PieChart";

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
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
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

  const getReport = async (currentYear: number) => {
    try {
      const res = await getReportAPI(currentYear);
      setReport(res);
    } catch (err) {
      console.error("Error fetching report data: ", err);
    }
  };

  useEffect(() => {
    getTop10Books();
    getReport(2024);
  }, []);

  const chartData = {
    labels: report.monthlyData.map((data) => `Tháng ${data.month}`) || [],
    datasets: [
      {
        label: "Revenue (VND)",
        data: report.monthlyData.map((data) => data.revenue) || [],
        backgroundColor: "linear-gradient(90deg, #3B82E6, #10B981)",
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: top10Books.map((book) => book.title),
    datasets: [
      {
        label: "Top 10 Books",
        data: top10Books.map((book) => book.totalSell),
        backgroundColor: [
          "#3B82E6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
          "#F472B6", "#34D399", "#FBBF24", "#6B7280", "#4B5563",
        ],
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
  };

  useEffect(() => {
    getReport(currentYear);
  }, [currentYear]);

  return (
    <div className="p-8 space-y-8 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        TỔNG QUAN UTESHOP TRONG NĂM {currentYear}
      </h2>

      <div className="text-center">
        <label htmlFor="year" className="font-bold mr-3 text-white">Chọn năm:</label>
        <select
          value={currentYear}
          onChange={(e) => setCurrentYear(Number(e.target.value))}
          className="bg-gradient-to-r from-blue-500 to-purple-500 w-48 text-center p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold text-white transition-all duration-300 hover:shadow-lg"
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <option
              key={index}
              value={new Date().getFullYear() - index}
              className="bg-gray-800 text-white font-bold"
            >
              {new Date().getFullYear() - index}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[
          { ref: totalUsersRef, title: 'NGƯỜI DÙNG', value: report.totalUsers, visible: isTotalUsersVisible, icon: '👥' },
          { ref: revenueRef, title: 'DOANH THU', value: totalRevenue, visible: isRevenueVisible, icon: '💰' },
          { ref: ordersRef, title: 'HÓA ĐƠN', value: report.totalOrders, visible: isOrdersVisible, icon: '📝' },
          { ref: booksRef, title: 'SÁCH', value: report.totalBooks, visible: isBooksVisible, icon: '📚' },
          { ref: soldBooksRef, title: 'SÁCH BÁN RA', value: totalSoldBooks, visible: isSoldBooksVisible, icon: '📈' },
        ].map((card, index) => (
          <div
            key={index}
            ref={card.ref}
            className={`backdrop-blur-md bg-opacity-20 bg-white p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 ${
              card.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="text-center space-y-3">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="font-semibold text-gray-200 text-lg">{card.title}</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl shadow-xl"> */}
            <LineChart data={chartData} />
          {/* </div> */}
          {/* <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl shadow-xl"> */}
            <PieChart data={pieChartData} />
          {/* </div> */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
              NGƯỜI DÙNG MỚI
            </h3>
            <div className="flex flex-wrap gap-6 justify-center">
              {report.newUsers.map((user) => (
                <div key={user.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-black bg-opacity-80 rounded-2xl p-4 space-y-3">
                    <img 
                      src={user.avatar_url} 
                      alt={user.firstname}
                      className="w-24 h-24 rounded-full mx-auto ring-4 ring-purple-500 object-cover transform group-hover:scale-105 transition duration-300" 
                    />
                    <p className="font-bold text-white text-center">{user.firstname} {user.lastname}</p>
                    <p className="text-gray-300 text-sm text-center">{formatDateTime(user.createAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            <h3 className="font-bold text-xl text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
              TOP 10 SÁCH BÁN CHẠY
            </h3>
            <ul className="space-y-3">
              {top10Books.map((book, index) => (
                <li key={book.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-gray-200 truncate">
                      {book.title}
                    </span>
                  </div>
                  <span className="flex-shrink-0 font-bold text-yellow-400 ml-4">{book.totalSell || 0} quyển</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            <h3 className="font-bold text-xl text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-4">
              DOANH THU THEO THÁNG
            </h3>
            <ul className="space-y-3">
              {report.monthlyData.map((data, index) => (
                <li key={data.month} className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                  <span className="text-gray-200">Tháng {data.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold">
                      {data.revenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </span>
                    <span className={`text-lg ${
                      index > 0
                        ? data.revenue > report.monthlyData[index - 1].revenue 
                          ? "text-green-500" 
                          : "text-red-500"
                        : "text-gray-400"
                    }`}>
                      {index > 0 && (data.revenue > report.monthlyData[index - 1].revenue ? "▲" : "▼")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
