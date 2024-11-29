import { useEffect, useState } from "react";
import { createFreeshipVoucher, getFreeshipVouchers, updateFreeshipVoucher } from "../../../apis/voucher";
import { BiAddToQueue } from "react-icons/bi";
import { FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [newFreeship, setNewFreeship] = useState<Freeship>({
    id: 0,
    code: "",
    name: "",
    discount_perc: null,
    discount_val: null,
    min_order_val: null,
    desc: "",
    stock: 0,
    is_active: true,
    createdAt: "",
    updatedAt: ""
  });
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

  const handleNewFreeshipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Freeship) => {
    const { value } = e.target;
    setNewFreeship((prevFreeship) => ({
      ...prevFreeship,
      [field]: field === "is_active" ? value === "active" : value
    }));
  };

  const handleAddFreeship = () => {
    const newFreeshipEntry = {
      ...newFreeship,
      id: Date.now()
    };
    createFreeshipVoucher(newFreeshipEntry);
    setFreeships((prevFreeships) => [newFreeshipEntry, ...prevFreeships]);
    setFilteredFreeships((prevFiltered) => [newFreeshipEntry, ...prevFiltered]);
    setNewFreeship({
      id: 0,
      code: "",
      name: "",
      discount_perc: null,
      discount_val: null,
      min_order_val: null,
      desc: "",
      stock: 0,
      is_active: true,
      createdAt: "",
      updatedAt: ""
    });
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Quản lý Freeship</h1>
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={isActiveFilter || ""}
              onChange={(e) => setIsActiveFilter(e.target.value || null)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-3">
                {/* Add New Freeship Card */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newFreeship.code}
                      onChange={(e) => handleNewFreeshipChange(e, "code")}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Mã"
                    />
                    <input
                      type="text"
                      value={newFreeship.name}
                      onChange={(e) => handleNewFreeshipChange(e, "name")}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tên"
                    />
                    <input
                      type="text"
                      value={newFreeship.desc}
                      onChange={(e) => handleNewFreeshipChange(e, "desc")}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Mô tả"
                    />
                    <input
                      type="number"
                      value={newFreeship.discount_perc || ""}
                      onChange={(e) => handleNewFreeshipChange(e, "discount_perc")}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="% Giảm"
                    />
                    <input
                      type="text"
                      value={newFreeship.discount_val || ""}
                      onChange={(e) => handleNewFreeshipChange(e, "discount_val")}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Giá trị"
                    />
                    <input
                      type="number"
                      value={newFreeship.stock}
                      onChange={(e) => handleNewFreeshipChange(e, "stock")}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Số lượng"
                    />
                    <input
                      type="text"
                      value={newFreeship.min_order_val || ""}
                      onChange={(e) => handleNewFreeshipChange(e, "min_order_val")}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Đơn tối thiểu"
                    />
                    <select
                      value={newFreeship.is_active ? "active" : "inactive"}
                      onChange={(e) => handleNewFreeshipChange(e, "is_active")}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ngừng</option>
                    </select>
                    <button onClick={handleAddFreeship} className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                      <BiAddToQueue className="mr-2" />
                      Thêm mới
                    </button>
                  </div>
                </div>

                {/* Existing Freeship Cards */}
                {paginatedData.map((freeship) => (
                  <div key={freeship.id} className={`bg-white p-6 rounded-lg shadow-lg border ${freeship.is_active ? 'border-gray-200' : 'border-red-200'} space-y-4`}>
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-lg">{freeship.code}</div>
                      <div className={`px-3 py-1 rounded-full text-sm ${freeship.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {freeship.is_active ? 'Hoạt động' : 'Ngừng'}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Tên:</span> {editingRow === freeship.id ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={freeship.name}
                          onChange={(e) => handleInputChange(e, freeship.id, "name")}
                        />
                      ) : (
                        freeship.name
                      )}
                    </div>

                    <div>
                      <span className="font-medium">Mô tả:</span> {editingRow === freeship.id ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={freeship.desc}
                          onChange={(e) => handleInputChange(e, freeship.id, "desc")}
                        />
                      ) : (
                        freeship.desc
                      )}
                    </div>

                    <div>
                      <span className="font-medium">% Giảm:</span> {editingRow === freeship.id ? (
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={freeship.discount_perc || ''}
                          onChange={(e) => handleInputChange(e, freeship.id, "discount_perc")}
                        />
                      ) : (
                        freeship.discount_perc
                      )}
                    </div>

                    <div>
                      <span className="font-medium">Giá trị:</span> {editingRow === freeship.id ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={freeship.discount_val || ''}
                          onChange={(e) => handleInputChange(e, freeship.id, "discount_val")}
                        />
                      ) : (
                        freeship.discount_val
                      )}
                    </div>

                    <div>
                      <span className="font-medium">Số lượng:</span> {editingRow === freeship.id ? (
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={freeship.stock}
                          onChange={(e) => handleInputChange(e, freeship.id, "stock")}
                        />
                      ) : (
                        freeship.stock
                      )}
                    </div>

                    <div>
                      <span className="font-medium">Đơn tối thiểu:</span> {editingRow === freeship.id ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={freeship.min_order_val || ''}
                          onChange={(e) => handleInputChange(e, freeship.id, "min_order_val")}
                        />
                      ) : (
                        freeship.min_order_val
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {editingRow === freeship.id ? (
                        <button onClick={() => handleSave(freeship)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                          <FaEdit className="w-5 h-5" />
                        </button>
                      ) : (
                        <button onClick={() => setEditingRow(freeship.id)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                          <FaEdit className="w-5 h-5" />
                        </button>
                      )}
                      <button onClick={() => handleToggleActive(freeship)} className={`p-2 rounded-lg transition ${freeship.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                        {freeship.is_active ? <FaToggleOff className="w-5 h-5" /> : <FaToggleOn className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

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

export default AdminFreeship;
