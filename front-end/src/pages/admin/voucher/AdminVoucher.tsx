import { useEffect, useState } from "react";
import { getDiscountVouchers, updateDiscountVoucher } from "../../../apis/voucher";

interface Discount {
  code: string;
  createdAt: string;
  desc: string;
  discount_perc: number;
  discount_val: string;
  id: number;
  is_active: boolean;
  min_order_val: string;
  name: string;
  stock: number;
  updatedAt: string;
}

const AdminVoucher = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState<Discount[]>([]);
  const [isActiveFilter, setIsActiveFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDiscountVouchers(1000, 0);
        setDiscounts(response.data);
        setFilteredDiscounts(response.data);
      } catch (error) {
        console.log("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = discounts;
    if (isActiveFilter !== null) {
      data = discounts.filter(
        (discount) => discount.is_active === (isActiveFilter === "active")
      );
    }
    setFilteredDiscounts(data);
  }, [isActiveFilter, discounts]);

  const sortData = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredDiscounts].sort((a, b) => {
      if (a[key as keyof Discount] < b[key as keyof Discount]) return direction === "asc" ? -1 : 1;
      if (a[key as keyof Discount] > b[key as keyof Discount]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredDiscounts(sortedData);
  };

  const handleSave = async (discount: Discount) => {
    try {
      await updateDiscountVoucher(discount.id.toString(), discount);
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((d) => (d.id === discount.id ? discount : d))
      );
      setEditingRow(null);
    } catch (error) {
      console.error("Failed to update discount", error);
    }
  };
  const handleToggleActive = async (discountId: number, newStatus: boolean) => {
    try {
      // Cập nhật trạng thái voucher
      const updatedDiscount = { ...discounts.find(d => d.id === discountId), is_active: newStatus };
      await updateDiscountVoucher(discountId.toString(), updatedDiscount);
  
      // Cập nhật lại trạng thái ở UI
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount.id === discountId ? { ...discount, is_active: newStatus } : discount
        )
      );
    } catch (error) {
      console.error("Failed to update voucher status", error);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
    discountId: number,
    field: keyof Discount
  ) => {
    const { value } = e.target;

    if (e.target instanceof HTMLInputElement) {
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount.id === discountId ? { ...discount, [field]: field === "is_active" ? value === "active" : value } : discount
        )
      );
    } else if (e.target instanceof HTMLSelectElement) {
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount.id === discountId ? { ...discount, [field]: field === "is_active" ? value === "active" : value } : discount
        )
      );
    }
  };

  const paginatedData = filteredDiscounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý Voucher</h1>

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
              <th className="p-4 cursor-pointer" onClick={() => sortData("name")}>Tên mã</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("desc")}>Mô tả</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("discount_perc")}>Phần trăm giảm</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("discount_val")}>Giá trị đơn hàng áp dụng</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("stock")}>Số lượng sử dụng</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("min_order_val")}>Giá trị tối thiểu</th>
              <th className="p-4 cursor-pointer" onClick={() => sortData("is_active")}>Trạng thái</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((discount) => (
              <tr key={discount.id} className={discount.is_active ? "bg-white" : "bg-red-100"}>
                <td className="p-4 border-t">{discount.code}</td>
                <td className="p-4 border-t">
                  {editingRow === discount.id ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={discount.name}
                      onChange={(e) => handleInputChange(e, discount.id, "name")}
                    />
                  ) : (
                    discount.name
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === discount.id ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={discount.desc}
                      onChange={(e) => handleInputChange(e, discount.id, "desc")}
                    />
                  ) : (
                    discount.desc
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === discount.id ? (
                    <input
                      type="number"
                      className="border p-1 rounded w-full"
                      value={discount.discount_perc}
                      onChange={(e) => handleInputChange(e, discount.id, "discount_perc")}
                    />
                  ) : (
                    discount.discount_perc
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === discount.id ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={discount.discount_val}
                      onChange={(e) => handleInputChange(e, discount.id, "discount_val")}
                    />
                  ) : (
                    discount.discount_val
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === discount.id ? (
                    <input
                      type="number"
                      className="border p-1 rounded w-full"
                      value={discount.stock}
                      onChange={(e) => handleInputChange(e, discount.id, "stock")}
                    />
                  ) : (
                    discount.stock
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === discount.id ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={discount.min_order_val}
                      onChange={(e) => handleInputChange(e, discount.id, "min_order_val")}
                    />
                  ) : (
                    discount.min_order_val
                  )}
                </td>
                <td className="p-4 border-t text-center">
                  {editingRow === discount.id ? (
                    <select
                      className="border p-1 rounded w-full"
                      value={discount.is_active ? "active" : "inactive"}
                      onChange={(e) => handleInputChange(e, discount.id, "is_active")}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    discount.is_active ? "Active" : "Inactive"
                  )}
                </td>
                <td className="p-4 border-t">
                  {editingRow === discount.id ? (
                    <button
                      className="bg-blue-500 text-white p-2 rounded"
                      onClick={() => handleSave(discount)}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        className="bg-green-500 text-white p-2 rounded mr-2"
                        onClick={() => setEditingRow(discount.id)}
                      >
                        Edit
                      </button>
                      <button
                        className={`${discount.is_active ? "bg-red-500" : "bg-blue-500"
                          } text-white p-2 rounded`}
                        onClick={() => handleToggleActive(discount.id, !discount.is_active)}
                      >
                        {discount.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 p-2 rounded"
          >
            Previous
          </button>
          <span className="mx-4">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-300 p-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminVoucher;
