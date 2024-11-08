import { useEffect, useState } from "react";
import { getFreeshipVouchers, updateFreeshipVoucher } from "../../../apis/voucher";

interface Freeship {
  id: number;
  code: string;
  name: string;
  discount_perc: number | null;
  discount_val: string | null;
  min_order_val: string | null;
  desc: string;
  stock: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminFreeship = () => {
  const [freeships, setFreeships] = useState<Freeship[]>([]);
  const [filteredFreeships, setFilteredFreeships] = useState<Freeship[]>([]);
  const [isActiveFilter, setIsActiveFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFreeshipVouchers(1000, 0);
        setFreeships(response.data);
        setFilteredFreeships(response.data);
      } catch (error) {
        console.log("Failed to fetch freeships", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = freeships;
    if (isActiveFilter !== null) {
      data = freeships.filter(
        (freeship) => freeship.is_active === (isActiveFilter === "active")
      );
    }
    setFilteredFreeships(data);
  }, [isActiveFilter, freeships]);

  const sortData = (key: keyof Freeship) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  
    const sortedData = [...filteredFreeships].sort((a, b) => {
      const valueA = a[key] ?? ""; // Thay thế giá trị null/undefined bằng chuỗi rỗng
      const valueB = b[key] ?? "";
  
      // Kiểm tra nếu giá trị là chuỗi
      if (typeof valueA === "string" && typeof valueB === "string") {
        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
      }
  
      // Kiểm tra nếu giá trị là số
      if (typeof valueA === "number" && typeof valueB === "number") {
        return direction === "asc" ? valueA - valueB : valueB - valueA;
      }
  
      // Nếu giá trị không phải là chuỗi hoặc số, trả về 0 (không thay đổi vị trí)
      return 0;
    });
  
    setFilteredFreeships(sortedData);
  };
  

  const handleSave = async (freeship: Freeship) => {
    try {
      await updateFreeshipVoucher(freeship.id.toString(), freeship);
      setFreeships((prevFreeships) =>
        prevFreeships.map((f) => (f.id === freeship.id ? freeship : f))
      );
      setEditingRow(null);
    } catch (error) {
      console.error("Failed to update freeship", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, freeshipId: number, field: keyof Freeship) => {
    const { value } = e.target;

    setFreeships((prevFreeships) =>
      prevFreeships.map((freeship) =>
        freeship.id === freeshipId ? { ...freeship, [field]: field === "is_active" ? value === "active" : value } : freeship
      )
    );
  };

  const paginatedData = filteredFreeships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredFreeships.length / itemsPerPage);
  const handleToggleActive = async (freeship: Freeship) => {
    const updatedFreeship = { ...freeship, is_active: !freeship.is_active };
    try {
      await updateFreeshipVoucher(freeship.id.toString(), updatedFreeship);
      setFreeships((prevFreeships) =>
        prevFreeships.map((f) => (f.id === freeship.id ? updatedFreeship : f))
      );
    } catch (error) {
      console.error("Failed to update freeship status", error);
    }
  };
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý Freeship</h1>

      <div className="mb-4">
        <label className="text-gray-700 font-semibold">Trạng thái:</label>
        <select
          className="ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={isActiveFilter || ""}
          onChange={(e) => setIsActiveFilter(e.target.value || null)}
        >
          <option value="">Tất cả</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="p-4 cursor-pointer" onClick={() => sortData("code")}>Code</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("name")}>Tên freeship</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("desc")}>Mô tả</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("discount_perc")}>Phần trăm giảm</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("discount_val")}>Giá trị freeship</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("stock")}>Số lượng sử dụng</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("min_order_val")}>Giá trị tối thiểu</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("is_active")}>Trạng thái</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((freeship) => (
              <tr key={freeship.id} className={freeship.is_active ? "bg-white" : "bg-red-100"}>
                <td className="p-4 border-t">{freeship.code}</td>
                <td className="p-4 border-t">
                  {editingRow === freeship.id ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={freeship.name}
                      onChange={(e) => handleInputChange(e, freeship.id, "name")}
                    />
                  ) : (
                    freeship.name
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === freeship.id ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={freeship.desc}
                      onChange={(e) => handleInputChange(e, freeship.id, "desc")}
                    />
                  ) : (
                    freeship.desc
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === freeship.id ? (
                    <input
                      type="number"
                      className="border p-1 rounded w-full"
                      value={freeship.discount_perc || ''}
                      onChange={(e) => handleInputChange(e, freeship.id, "discount_perc")}
                    />
                  ) : (
                    freeship.discount_perc
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === freeship.id ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={freeship.discount_val || ''}
                      onChange={(e) => handleInputChange(e, freeship.id, "discount_val")}
                    />
                  ) : (
                    freeship.discount_val
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === freeship.id ? (
                    <input
                      type="number"
                      className="border p-1 rounded w-full"
                      value={freeship.stock}
                      onChange={(e) => handleInputChange(e, freeship.id, "stock")}
                    />
                  ) : (
                    freeship.stock
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === freeship.id ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={freeship.min_order_val || ''}
                      onChange={(e) => handleInputChange(e, freeship.id, "min_order_val")}
                    />
                  ) : (
                    freeship.min_order_val
                  )}
                </td>
                <td className="p-4 border-t text-center">
                  {editingRow === freeship.id ? (
                    <select
                      className="border p-1 rounded w-full"
                      value={freeship.is_active ? "active" : "inactive"}
                      onChange={(e) => handleInputChange(e, freeship.id, "is_active")}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    freeship.is_active ? "Active" : "Inactive"
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === freeship.id ? (
                    <button
                      onClick={() => handleSave(freeship)}
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      Lưu
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingRow(freeship.id)}
                      className="bg-yellow-500 text-white p-2 rounded"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleActive(freeship)}
                    className={`p-2 rounded ${freeship.is_active ? "bg-red-500" : "bg-green-500"} text-white`}
                  >
                    {freeship.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          className="bg-gray-300 p-2 rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Trang trước
        </button>
        <div>
          Trang {currentPage} của {totalPages}
        </div>
        <button
          className="bg-gray-300 p-2 rounded"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default AdminFreeship;
