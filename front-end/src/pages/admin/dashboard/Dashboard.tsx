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
    <div className="p-5 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-white">TỔNG QUAN UTESHOP TRONG NĂM {currentYear}</h2>
      <div className="text-center">
        <label htmlFor="year" className="text-white font-bold mr-2">Chọn năm:</label>
        <select
          value={currentYear}
          onChange={(e) => setCurrentYear(Number(e.target.value))}
          className="bg-white w-1/5 text-center p-2 rounded-lg focus:outline-none font-bold"
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <option
              key={index}
              value={new Date().getFullYear() - index}
              className="text-black font-bold"
            >
              {new Date().getFullYear() - index}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Info Cards */}
        {[
          { ref: totalUsersRef, title: 'NGƯỜI DÙNG', value: report.totalUsers, visible: isTotalUsersVisible },
          { ref: revenueRef, title: 'DOANH THU', value: totalRevenue, visible: isRevenueVisible },
          { ref: ordersRef, title: 'HÓA ĐƠN', value: report.totalOrders, visible: isOrdersVisible },
          { ref: booksRef, title: 'SÁCH', value: report.totalBooks, visible: isBooksVisible },
          { ref: soldBooksRef, title: 'SÁCH BÁN RA', value: totalSoldBooks, visible: isSoldBooksVisible },
        ].map((card, index) => (
          <div
            key={index}
            ref={card.ref}
            className={`bg-gradient-to-r p-4 rounded-lg text-center shadow-lg flex flex-col items-center justify-center transition-opacity duration-700 ${
              card.visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: `linear-gradient(to right, ${index % 2 === 0 ? '#4F46E5' : '#D946EF'}, ${
                index % 2 === 0 ? '#9333EA' : '#EC4899'
              })`,
            }}
          >
            <h3 className="font-semibold text-white">{card.title}</h3>
            <p className="text-4xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <LineChart data={chartData} />
          <PieChart data={pieChartData} />
          <div>
        <h3 className="font-semibold text-center text-white">NGƯỜI DÙNG MỚI</h3>
        <ul className="flex flex-wrap gap-4 mt-4 justify-center">
          {report.newUsers.map((user) => (
            <li key={user.id} className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-center shadow-lg">
              <img src={user.avatar_url} alt={user.firstname} className="w-24 h-24 rounded-full mx-auto mb-2 object-cover shadow-lg" />
              <p className="font-bold text-white">{user.firstname} {user.lastname}</p>
              <p className="text-white">{formatDateTime(user.createAt)}</p>
            </li>
          ))}
        </ul>
      </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-center text-black">TOP 10 SÁCH BÁN CHẠY HIỆN TẠI</h3>
            <ul className="mt-4 space-y-2">
              {top10Books.map((book, index) => (
                <li key={book.id} className="flex justify-between p-2 rounded-full hover:bg-yellow-700 hover:text-white transition">
                  <span>{index + 1}. {book.title}</span>
                  <span>{book.totalSell} quyển</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-center text-black">DOANH THU THEO THÁNG</h3>
            <ul className="mt-4 space-y-2">
              {report.monthlyData.map((data, index) => (
                <li key={data.month} className="flex justify-between p-2 rounded-full hover:bg-blue-700 hover:text-white transition">
                  <span>Tháng {data.month}</span>
                  <span>{data.revenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                  <span className={`text-sm font-semibold ${
                    index > 0
                      ? data.revenue > report.monthlyData[index - 1].revenue ? "text-green-500" : "text-red-500"
                      : "text-white"
                  }`}>
                    {index > 0 && (data.revenue > report.monthlyData[index - 1].revenue ? "▲" : "▼")}
                  </span>
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
