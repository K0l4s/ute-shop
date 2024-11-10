import { useEffect, useState } from "react";
import { getAllUsers } from "../../../apis/user";

export interface UserData {
  id: Number;
  firstname: string,
  lastname: string,
  province: string,
  district: string,
  ward: string,
  address: string,
  birthday: Date,
  gender: boolean,
  avatar_url: string,
  phone: string,
  email: string,
  role: string,
  createAt: string,
  total_orders: Number,
  total_spent: string
}
const AdminUser = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      await getAllUsers().then((data) => {
        setUsers(data.data);
      });
    };
    fetchData();
  }
    , []);
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  }
  const formatMoney = (money: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(money));
  }
  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl mb-6 text-white">Quản lý khách hàng</h1>
      
      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <p className="font-semibold text-lg mb-3 text-gray-700">Phân loại khách hàng theo tổng chi tiêu</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { color: "yellow", range: "500k - 1tr" },
            { color: "green", range: "1tr - 2tr" }, 
            { color: "blue", range: "2tr - 5tr" },
            { color: "purple", range: "5tr - 10tr" },
            { color: "red", range: "Trên 10tr" }
          ].map(({color, range}) => (
            <div key={color} className="flex items-center space-x-2">
              <div className={`w-6 h-6 bg-${color}-100 border border-gray-300 rounded`}></div>
              <span className="text-sm text-gray-600">{range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm uppercase tracking-wider">
              <th className="py-4 px-6 text-left font-semibold">STT</th>
              <th className="py-4 px-6 text-left font-semibold">Avatar</th>
              <th className="py-4 px-6 text-left font-semibold">Họ</th>
              <th className="py-4 px-6 text-left font-semibold">Tên</th>
              <th className="py-4 px-6 text-left font-semibold">Giới tính</th>
              <th className="py-4 px-6 text-left font-semibold">Ngày sinh</th>
              <th className="py-4 px-6 text-left font-semibold">Email</th>
              <th className="py-4 px-6 text-left font-semibold">Điện thoại</th>
              <th className="py-4 px-6 text-left font-semibold">Vai trò</th>
              <th className="py-4 px-6 text-left font-semibold">Tổng đơn</th>
              <th className="py-4 px-6 text-left font-semibold">Tổng chi</th>
              <th className="py-4 px-6 text-left font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user: UserData, index: number) => {
              const spentAmount = Number(user.total_spent);
              const getBgColor = () => {
                if (spentAmount > 10000000) return "bg-red-50";
                if (spentAmount > 5000000) return "bg-purple-50";
                if (spentAmount > 2000000) return "bg-blue-50";
                if (spentAmount > 1000000) return "bg-green-50";
                if (spentAmount > 500000) return "bg-yellow-50";
                return "";
              };
              
              return (
                <tr key={user.id.toString()} 
                    className={`${getBgColor()} hover:bg-gray-50 transition-colors duration-200`}>
                  <td className="py-4 px-6 text-sm">{index + 1}</td>
                  <td className="py-4 px-6">
                    <img
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors duration-200 shadow-sm"
                      src={user.avatar_url || "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"}
                      alt={user.firstname}
                    />
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{user.lastname}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{user.firstname}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${user.gender ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}`}>
                      {user.gender ? "Nam" : "Nữ"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{formatDate(user.birthday)}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.phone}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                      {user.role === "admin" ? "QUẢN TRỊ VIÊN" : "KHÁCH HÀNG"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold">{user.total_orders.toString()}</td>
                  <td className="py-4 px-6 text-sm font-semibold">{formatMoney(user.total_spent)}</td>
                  <td className="py-4 px-6">
                    <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="flex space-x-2" aria-label="Pagination">
          <button className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Trước
          </button>
          <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
            1
          </button>
          <button className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Sau
          </button>
        </nav>
      </div>
    </div>
  )
}

export default AdminUser