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
    <div>
      <h1 className="font-bold text-2xl">Quản lý khách hàng</h1>
      <div>
        <p className="">Ghi chú</p>
        {/* các ô màu */}
        <table>
          <tr >
            <td className="bg-yellow-100 p-2 border border-black"></td>
            <td>Tổng chi từ 500k - 1tr</td>
          </tr>
          <tr>
            <td className="bg-green-100 p-2 border border-black"></td>
            <td>Tổng chi từ 1-2tr</td>
          </tr>
          <tr>
            <td className="bg-blue-100 p-2 border border-black"></td>
            <td>Tổng chi từ 2-5tr</td>
          </tr>
          <tr>
            <td className="bg-purple-100 p-2 border border-black"></td>
            <td>Tổng chi từ 5-10tr</td>
          </tr>
          <tr>
            <td className="bg-red-100 p-2 border border-black"></td>
            <td>Tổng chi trên 10tr</td>
          </tr>
        </table>
      </div>
      <table className="
      table-auto w-full text-left border-collapse border border-gray-300 mt-4 bg-white shadow-md rounded-lg overflow-hidden
      ">
        <thead>
          <tr className="bg-blue-400 text-white">
            <th className="p-3">STT</th>
            <th className="p-3">Avatar</th>
            <th className="p-3">Họ</th>
            <th className="p-3">Tên</th>
            <th className="p-3">Giới tính</th>
            <th className="p-3">Ngày sinh</th>
            <th className="p-3">Email</th>
            <th className="p-3">Điện thoại</th>
            <th className="p-3">Vai trò</th>
            <th className="p-3">Tổng đơn hàng</th>
            <th className="p-3">Tổng tiền đã chi</th>
            <th className="p-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: UserData, index: number) => (
            <tr key={user.id.toString()} className={`hover:bg-gray-100 border-t border-gray-300
            ${Number(user.total_spent) > 500000 ? "bg-red-100" : ""}
            ${Number(user.total_spent) > 1000000 ? "bg-yellow-100" : ""}
            ${Number(user.total_spent) > 2000000 ? "bg-green-100" : ""}
            ${Number(user.total_spent) > 5000000 ? "bg-blue-100" : ""}
            ${Number(user.total_spent) > 10000000 ? "bg-purple-100" : ""}
            
            `}>
              <td className="p-3">{index + 1}</td>
              <td className="w-12 h-12 p-1">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={user.avatar_url || "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"}
                  alt={user.firstname}
                />
              </td>
              <td className="p-3">{user.lastname}</td>
              <td className="p-3">{user.firstname}</td>
              <td className="p-3">{user.gender ? "Nam" : "Nữ"}</td>
              <td className="p-3">{formatDate(user.birthday)}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phone}</td>
              <td className={`p-3 ${user.role == "admin" ? "bg-red-300 font-bold" : ""}`}>{user.role == "admin" ? "QUẢN TRỊ VIÊN" : "KHÁCH HÀNG"}</td>
              <td className="p-3">{user.total_orders.toString()}</td>
              <td className="p-3">{formatMoney(user.total_spent)}</td>
              <td className="p-3">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Xem</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* phân trang */}
      <div>
        <div className="flex justify-center items-center my-4">
          <button className="px-3 py-1 mx-1 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400">Trước</button>
          <button className="px-3 py-1 mx-1 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400">1</button>
          <button className="px-3 py-1 mx-1 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400">Sau</button>
        </div>
      </div>
    </div>
  )
}

export default AdminUser