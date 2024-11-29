import { useEffect, useState } from "react";
import { createDiscountVoucher, getDiscountVouchers, updateDiscountVoucher } from "../../../apis/voucher";
import { FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [newVoucher, setNewVoucher] = useState<Discount>({
    code: "",
    createdAt: "",
    desc: "",
    discount_perc: 0,
    discount_val: "",
    id: 0,
    is_active: true,
    min_order_val: "",
    name: "",
    stock: 0,
    updatedAt: "",
  });
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

  const handleToggleActive = async (discount: Discount) => {
    try {
      const updatedDiscount = { ...discount, is_active: !discount.is_active };
      await updateDiscountVoucher(discount.id.toString(), updatedDiscount);
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((d) => (d.id === discount.id ? updatedDiscount : d))
      );
    } catch (error) {
      console.error("Failed to update voucher status", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    discountId: number,
    field: keyof Discount
  ) => {
    const { value } = e.target;
    setDiscounts((prevDiscounts) =>
      prevDiscounts.map((discount) =>
        discount.id === discountId ? { ...discount, [field]: field === "is_active" ? value === "active" : value } : discount
      )
    );
  };

  const paginatedData = filteredDiscounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

  const handleNewVoucherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Discount) => {
    const { value } = e.target;
    setNewVoucher((prev) => ({
      ...prev,
      [field]: field === "is_active" ? value === "active" : value
    }));
  };

  const handleAddVoucher = async () => {
    try {
      const response = await createDiscountVoucher(newVoucher);
      setDiscounts((prev) => [...prev, response.data]);
      setNewVoucher({
        code: "",
        createdAt: "",
        desc: "",
        discount_perc: 0,
        discount_val: "",
        id: 0,
        is_active: true,
        min_order_val: "",
        name: "",
        stock: 0,
        updatedAt: "",
      });
    } catch (error) {
      console.error("Failed to create new voucher", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-white font-bold mb-6">Quản lý Voucher</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <select
            value={isActiveFilter || ""}
            onChange={(e) => setIsActiveFilter(e.target.value || null)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng</option>
          </select>
        </div>

        <div className="overflow-x-auto ">
          <div className="space-y-4  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl-grid-cols-3 lg:grid-cols-3 gap-6 p-3">
            {/* Add New Voucher Card */}
            <div className="border p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã</label>
                  <input
                    type="text"
                    value={newVoucher.code}
                    onChange={(e) => handleNewVoucherChange(e, "code")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên</label>
                  <input
                    type="text"
                    value={newVoucher.name}
                    onChange={(e) => handleNewVoucherChange(e, "name")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <input
                    type="text"
                    value={newVoucher.desc}
                    onChange={(e) => handleNewVoucherChange(e, "desc")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">% Giảm</label>
                  <input
                    type="number"
                    value={newVoucher.discount_perc}
                    onChange={(e) => handleNewVoucherChange(e, "discount_perc")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giá trị giảm</label>
                  <input
                    type="text"
                    value={newVoucher.discount_val}
                    onChange={(e) => handleNewVoucherChange(e, "discount_val")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                  <input
                    type="number"
                    value={newVoucher.stock}
                    onChange={(e) => handleNewVoucherChange(e, "stock")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Đơn tối thiểu</label>
                  <input
                    type="text"
                    value={newVoucher.min_order_val}
                    onChange={(e) => handleNewVoucherChange(e, "min_order_val")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    value={newVoucher.is_active ? "active" : "inactive"}
                    onChange={(e) => handleNewVoucherChange(e, "is_active")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddVoucher}
                className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Thêm mới
              </button>
            </div>

            {/* Display Voucher Cards */}
            {paginatedData.map((discount) => (
              <div
                key={discount.id}
                className={`border p-6 rounded-lg shadow-md ${discount.is_active ? 'bg-white' : 'bg-red-100'}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <strong className="text-gray-700">Mã:</strong>
                    <span>{discount.code}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-gray-700">Tên:</strong>
                    {editingRow === discount.id ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={discount.name}
                        onChange={(e) => handleInputChange(e, discount.id, "name")}
                      />
                    ) : (
                      <span>{discount.name}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-gray-700">Mô tả:</strong>
                    {editingRow === discount.id ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={discount.desc}
                        onChange={(e) => handleInputChange(e, discount.id, "desc")}
                      />
                    ) : (
                      <span>{discount.desc}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-gray-700">% Giảm:</strong>
                    {editingRow === discount.id ? (
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={discount.discount_perc}
                        onChange={(e) => handleInputChange(e, discount.id, "discount_perc")}
                      />
                    ) : (
                      <span>{discount.discount_perc}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-gray-700">Giá trị giảm:</strong>
                    {editingRow === discount.id ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={discount.discount_val}
                        onChange={(e) => handleInputChange(e, discount.id, "discount_val")}
                      />
                    ) : (
                      <span>{discount.discount_val}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-gray-700">Số lượng:</strong>
                    {editingRow === discount.id ? (
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={discount.stock}
                        onChange={(e) => handleInputChange(e, discount.id, "stock")}
                      />
                    ) : (
                      <span>{discount.stock}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-gray-700">Đơn tối thiểu:</strong>
                    {editingRow === discount.id ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={discount.min_order_val}
                        onChange={(e) => handleInputChange(e, discount.id, "min_order_val")}
                      />
                    ) : (
                      <span>{discount.min_order_val}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-gray-700">Trạng thái:</strong>
                    {editingRow === discount.id ? (
                      <select
                        className="w-full px-3 py-2 border rounded-lg"
                        value={discount.is_active ? "active" : "inactive"}
                        onChange={(e) => handleInputChange(e, discount.id, "is_active")}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Ngừng</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm ${discount.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {discount.is_active ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  {editingRow === discount.id ? (
                    <button
                      onClick={() => handleSave(discount)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingRow(discount.id)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleActive(discount)}
                    className={`p-2 rounded-lg transition ${discount.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  >
                    {discount.is_active ? <FaToggleOff className="w-5 h-5" /> : <FaToggleOn className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            className={`px-4 py-2 rounded-lg transition ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Trang trước
          </button>
          <span className="text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded-lg transition ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminVoucher;
