import { useEffect, useState } from "react";
import { getPublisher, updatePublisher } from "../../../apis/publisher";
import { FaCheck, FaEdit, FaPlus } from "react-icons/fa";
import ModalPublisher from "../../../components/modals/ModalPublisher";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

interface Book {
  id: number;
  title: string;
}
interface Publisher {
  id: number;
  name: string;
  address: string;
  books: Book[];
}

const AdminPublisher = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isOpenCreatePublisher, setIsOpenCreatePublisher] = useState(false);
  const [editId, setEditId] = useState<number | null>(null); // Track editing row
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    minBooks: 0,
    maxBooks: 100,
  });
  const [editPublisherData, setEditPublisherData] = useState<Partial<Publisher>>({});

  const openModal = () => setIsOpenCreatePublisher(true);
  const closeModal = () => setIsOpenCreatePublisher(false);

  useEffect(() => {
    const fetchPublishers = async () => {
      getPublisher().then((res) => {
        setPublishers(res.data);
        setFilteredPublishers(res.data);
      });
    };
    fetchPublishers();
  }, [isOpenCreatePublisher]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name.includes("Books") ? parseInt(value) : value,
    }));
  };

  const applyFilters = () => {
    let filtered = publishers;

    if (filters.name) {
      filtered = filtered.filter((publisher) =>
        publisher.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.address) {
      filtered = filtered.filter((publisher) =>
        publisher.address.toLowerCase().includes(filters.address.toLowerCase())
      );
    }
    filtered = filtered.filter(
      (publisher) =>
        publisher.books.length >= filters.minBooks && publisher.books.length <= filters.maxBooks
    );

    setFilteredPublishers(filtered);
    setCurrentPage(1);
  };

  const startEdit = (publisher: Publisher) => {
    setEditId(publisher.id);
    setEditPublisherData({ ...publisher });
  };

  const saveEdit = async (publisherId: number) => {
    const updatedPublishers = publishers.map((publisher) =>
      publisher.id === publisherId ? { ...publisher, ...editPublisherData } : publisher
    );
    await updatePublisher(publisherId, editPublisherData.name?.toString() || "", editPublisherData.address?.toString() || "");
    setPublishers(updatedPublishers);
    setFilteredPublishers(updatedPublishers);
    setEditId(null); // Exit edit mode
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    setEditPublisherData((prevData) => ({ ...prevData, [field]: value }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPublishers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Quản lý nhà xuất bản</h1>
      <button 
        onClick={openModal}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 mb-5"
      >
        <FaPlus className="mr-2" /> Thêm Nhà xuất bản
      </button>

      {/* Bộ lọc */}
      <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">Bộ lọc tìm kiếm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Lọc theo tên nhà xuất bản..."
            value={filters.name}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            name="address"
            placeholder="Lọc theo địa chỉ..."
            value={filters.address}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label className="text-white font-medium mb-2 block">Số lượng sách:</label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute -top-8 bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-medium shadow-lg">
                {filters.minBooks}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minBooks}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  setFilters((prev) => ({
                    ...prev,
                    minBooks: newMin,
                    maxBooks: Math.max(newMin, prev.maxBooks)
                  }));
                }}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-medium">{filters.minBooks}</span>
            </div>

            <span className="text-white font-bold">-</span>

            <div className="relative flex-1">
              <span className="absolute -top-8 bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-medium shadow-lg">
                {filters.maxBooks}
              </span>
              <input
                type="range"
                min={filters.minBooks}
                max="100"
                value={filters.maxBooks}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    maxBooks: parseInt(e.target.value),
                  }));
                }}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-medium">{filters.maxBooks}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={applyFilters}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Áp dụng bộ lọc
        </button>
      </div>

      {/* Bảng nhà xuất bản */}
      <div className="overflow-x-auto rounded-lg shadow-xl">
        <table className="w-full bg-gray-800 border border-gray-700">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="py-3 px-4 text-left font-semibold">ID</th>
              <th className="py-3 px-4 text-left font-semibold">Tên nhà xuất bản</th>
              <th className="py-3 px-4 text-left font-semibold">Số lượng sách</th>
              <th className="py-3 px-4 text-left font-semibold">Địa chỉ</th>
              <th className="py-3 px-4 text-left font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((publisher, index) => (
              <tr key={publisher.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600 transition-colors`}>
                <td className="py-3 px-4 text-gray-200">{publisher.id}</td>
                <td className="py-3 px-4 text-gray-200">
                  {editId === publisher.id ? (
                    <input
                      type="text"
                      value={editPublisherData.name || ""}
                      onChange={(e) => handleEditChange(e, "name")}
                      className="w-full px-3 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    publisher.name
                  )}
                </td>
                <td className="py-3 px-4 text-gray-200">{publisher.books?.length || 0}</td>
                <td className="py-3 px-4 text-gray-200">
                  {editId === publisher.id ? (
                    <input
                      type="text"
                      value={editPublisherData.address || ""}
                      onChange={(e) => handleEditChange(e, "address")}
                      className="w-full px-3 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    publisher.address
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === publisher.id ? (
                    <button
                      onClick={() => saveEdit(publisher.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <FaCheck className="inline-block mr-2" />
                      Lưu
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(publisher)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <FaEdit className="inline-block mr-2" />
                      Chỉnh sửa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="flex justify-center items-center gap-6 mt-8 mb-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
              currentPage === 1 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            <BiLeftArrow className="animate-pulse" />
            <span>Trước</span>
          </button>
          
          <span className="text-white font-medium bg-blue-600/30 px-4 py-2 rounded-lg">
            Trang {currentPage} / {Math.ceil(filteredPublishers.length / itemsPerPage)}
          </span>
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredPublishers.length / itemsPerPage)}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
              currentPage === Math.ceil(filteredPublishers.length / itemsPerPage)
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            <span>Tiếp</span>
            <BiRightArrow className="animate-pulse" />
          </button>
        </div>
      </div>

      {isOpenCreatePublisher && <ModalPublisher onClose={closeModal} />}
    </div>
  );
};

export default AdminPublisher;
