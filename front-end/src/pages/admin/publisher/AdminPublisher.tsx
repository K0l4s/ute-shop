import { useEffect, useState } from "react";
import { getPublisher } from "../../../apis/publisher";
import { FaPlus } from "react-icons/fa";
import ModalPublisher from "../../../components/modals/ModalPublisher";

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
  const [itemsPerPage] = useState(5); // Số mục trên mỗi trang
  const [isOpenCreatePublisher, setIsOpenCreatePublisher] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    minBooks: 0,
    maxBooks: 100, // Giá trị tối đa mặc định
  });
  const openModal = () => {
    setIsOpenCreatePublisher(true);
}
const closeModal = () => {
  setIsOpenCreatePublisher(false);
}
  useEffect(() => {
    const fetchPublishers = async () => {
      getPublisher().then((res) => {
        setPublishers(res.data);
        setFilteredPublishers(res.data);
      });
    };
    fetchPublishers();
  }, []);

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
    setCurrentPage(1); // Đặt lại trang về trang đầu tiên khi lọc
  };

  // Xác định số mục hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPublishers.slice(indexOfFirstItem, indexOfLastItem);

  // Chuyển trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Quản lý nhà xuất bản</h1>
      <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-5" onClick={openModal}>
        <FaPlus className="mr-2" /> Thêm Nhà xuất bản
      </button>
      
      <h1 className="text-white font-bold mb-2">Bộ lọc</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Lọc theo tên"
          value={filters.name}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="address"
          placeholder="Lọc theo địa chỉ"
          value={filters.address}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="text-white mr-2">Số sách: {filters.minBooks} - {filters.maxBooks}</label>
        <input
          type="range"
          min="0"
          max="100" // Thay đổi giá trị tối đa để phù hợp
          value={filters.minBooks}
          onChange={(e) => {
            const newMin = parseInt(e.target.value);
            setFilters((prev) => ({
              ...prev,
              minBooks: newMin,
              maxBooks: newMin < prev.maxBooks ? prev.maxBooks : newMin // Đảm bảo min không lớn hơn max
            }));
          }}
          className="mx-2"
        />
        <input
          type="range"
          min={filters.minBooks}
          max="100" // Thay đổi giá trị tối đa để phù hợp
          value={filters.maxBooks}
          onChange={(e) => {
            const newMax = parseInt(e.target.value);
            setFilters((prev) => ({
              ...prev,
              maxBooks: newMax,
            }));
          }}
          className="mx-2"
        />
      </div>
      <button onClick={applyFilters} className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Áp dụng lọc
      </button>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white text-left font-semibold">
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Tên nhà xuất bản</th>
              <th className="py-3 px-4 border-b">Số lượng sách</th>
              <th className="py-3 px-4 border-b">Địa chỉ</th>
              <th className="py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((publisher, index) => (
              <tr key={publisher.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="py-2 px-4 border-b text-gray-700">{publisher.id}</td>
                <td className="py-2 px-4 border-b text-gray-700">{publisher.name}</td>
                <td className="py-2 px-4 border-b text-gray-700">{publisher.books?.length || 0}</td>
                <td className="py-2 px-4 border-b text-gray-700">{publisher.address}</td>
                <td className="py-2 px-4 border-b text-gray-700 flex gap-2">
                  <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md">Chi tiết</button>
                  <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md">Điều chỉnh</button>
                  <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md">Thêm sách mới</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="flex justify-end items-center mt-4 gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
          >
            Prev
          </button>
          {[...Array(Math.ceil(filteredPublishers.length / itemsPerPage)).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-800 text-white"
              }`}
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredPublishers.length / itemsPerPage)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
      {isOpenCreatePublisher && <ModalPublisher onClose={closeModal} />}
    </div>
  );
};

export default AdminPublisher;
