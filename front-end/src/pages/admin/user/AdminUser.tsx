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
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]); // For filtered data
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [selectedRole, setSelectedRole] = useState(""); // For role filter
  const [selectedGender, setSelectedGender] = useState(""); // For gender filter

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllUsers();
      setUsers(data.data);
      setFilteredUsers(data.data); // Initially set all users as filtered
    };
    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatMoney = (money: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(money));
  };

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredUsers(
      users.filter((user) =>
        user.firstname.toLowerCase().includes(lowercasedQuery) ||
        user.lastname.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.phone.includes(lowercasedQuery)
      )
    );
  };

  const handleFilter = () => {
    let filteredData = [...users];

    if (selectedRole) {
      filteredData = filteredData.filter((user) => user.role.toLowerCase() === selectedRole.toLowerCase());
    }

    if (selectedGender) {
      filteredData = filteredData.filter((user) => (selectedGender === "male" ? user.gender : !user.gender));
    }

    setFilteredUsers(filteredData);
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl mb-6 text-white">Quản lý khách hàng</h1>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex space-x-4">
        {/* Search */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Tìm kiếm
          </button>
        </div>

        {/* Role Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Chọn vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="customer">Khách hàng</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Lọc
        </button>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <p className="font-semibold text-lg mb-3 text-gray-700">Phân loại khách hàng theo tổng chi tiêu</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[{ color: "yellow", range: "500k - 1tr" }, { color: "green", range: "1tr - 2tr" }, { color: "blue", range: "2tr - 5tr" }, { color: "purple", range: "5tr - 10tr" }, { color: "red", range: "Trên 10tr" }].map(({ color, range }) => (
            <div key={color} className="flex items-center space-x-2">
              <div className={`w-6 h-6 bg-${color}-100 border border-gray-300 rounded`}></div>
              <span className="text-sm text-gray-600">{range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Users Card Layout */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user: UserData) => {
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
              <div
                key={user.id.toString()}
                className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ${getBgColor()}`}
              >
                <div className="flex items-center mb-4">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors duration-200 shadow-sm"
                    src={user.avatar_url || "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"}
                    alt={user.firstname}
                  />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{user.firstname} {user.lastname}</h3>
                    <p className="text-sm text-gray-600">{user.role === "admin" ? "QUẢN TRỊ VIÊN" : "KHÁCH HÀNG"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Giới tính:</span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${user.gender ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}`}>
                      {user.gender ? "Nam" : "Nữ"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Ngày sinh:</span>
                    <span className="text-sm text-gray-600">{formatDate(user.birthday)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Điện thoại:</span>
                    <span className="text-sm text-gray-600">{user.phone}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Tổng đơn:</span>
                    <span className="text-sm text-gray-600">{user.total_orders.toString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Tổng chi:</span>
                    <span className="text-sm text-gray-600">{formatMoney(user.total_spent)}</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
  );
};

export default AdminUser;
