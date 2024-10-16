import { useEffect, useState } from "react";
import BarChart from "./BarChart"
import { getTop10BooksAPI } from "../../../apis/book";



const Dashboard = () => {
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Revenue (VND)',
        data: [3000, 2000, 1000, 5000, 4000, 700],
        backgroundColor: ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6'],
      }
    ]
  };
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
  const [top10Books, setTop10Books] = useState<Book[]>([]);
  const getTop10Books = async () => {
    try {
      getTop10BooksAPI().
      then((res) => 
      {
        setTop10Books(res.data);
      }
      );
    } catch (err) {
      console.error("Error fetching data: ", err);
    }
  }
  useEffect(() => {
    getTop10Books();
    console.log(top10Books);
  }
    , []);
  return (
    <>
      <h2 className="text-2xl font-semibold text-center">Welcome to Admin Dashboard</h2>
      {/* line */}
      <div className="w-full h-0.5 bg-gray-300 my-4"></div>
      <h1 className="text-xl font-bold">Tổng doanh thu: 1 tỷ 200 triệu vnđ</h1>
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
            <p className="font-bold text-5xl">100</p>
          </div>
          <div className="w-11/12 mb-4 bg-blue-200 rounded-xl shadow-xl">
            <h3 className="font-semibold">Tổng số sản phẩm</h3>
            <p>200</p>
          </div>
          <div className="w-11/12 bg-blue-200 rounded-xl shadow-xl">
            <h3 className="font-semibold">Tổng số khách hàng</h3>
            <p>300</p>
          </div>
          <div className="w-11/12 bg-blue-200 rounded-xl shadow-xl">

            <h3 className="font-semibold">Tổng số đơn hàng</h3>
            <p>30</p>
          </div>
        </div>

      </div>
      <div className="flex">
        <div className="w-2/3 p-4 shadow-xl rounded-lg bg-white rounded-xl m-2">
          <h3 className="font-semibold">Người dùng mới</h3>
          <ul>
            {/* <li className="flex justify-between items-center">
              <p>1. Sách A</p>
              <p>1000</p>
            </li>
            <li className="flex justify-between items-center">
              <p>2. Sách B</p>
              <p>900</p>
            </li>
            <li className="flex justify-between items-center">
              <p>3. Sách C</p>
              <p>800</p>
            </li>
            <li className="flex justify-between items-center">
              <p>4. Sách D</p>
              <p>700</p>
            </li>
            <li className="flex justify-between items-center">
              <p>5. Sách E</p>
              <p>600</p>
            </li> */}
           
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
  )
}

export default Dashboard