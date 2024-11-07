import { useEffect, useState } from "react";
import { getPublisher, updatePublisher } from "../../../apis/publisher";
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
      <h1 className="text-2xl font-bold mb-6 ">Quản lý nhà xuất bản</h1>
      <button className="flex text-white items-center px-4 py-2 bg-gray-800 rounded-md mb-5" onClick={openModal}>
        <FaPlus className="mr-2" /> Thêm Nhà xuất bản
      </button>

      {/* Bộ lọc */}
      <h1 className=" font-bold mb-2">Bộ lọc</h1>
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

      <div className="mb-4 flex items-center gap-4">
        <label className=" mr-2">Số sách:</label>
        <div className="flex items-center">
          {/* Minimum Books Range */}
          <div className="relative flex items-center">
            <span className="absolute -top-8 bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md">
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
                  maxBooks: newMin < prev.maxBooks ? prev.maxBooks : newMin
                }));
              }}
              className="range-slider mx-2"
            />
            <span className="font-bold px-3 py-1 rounded border">{`${filters.minBooks}`}</span>
          </div>

          <span className="text-white mx-2">-</span>

          {/* Maximum Books Range */}
          <div className="relative flex items-center">
            <span className="absolute -top-8 bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md">
              {filters.maxBooks}
            </span>
            <input
              type="range"
              min={filters.minBooks}
              max="100"
              value={filters.maxBooks}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                setFilters((prev) => ({
                  ...prev,
                  maxBooks: newMax,
                }));
              }}
              className="range-slider mx-2"
            />
            <span className=" font-bold px-3 py-1 rounded border">{`${filters.maxBooks}`}</span>
          </div>
        </div>
      </div>


      <button onClick={applyFilters} className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Áp dụng lọc
      </button>

      {/* Bảng nhà xuất bản */}
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
                <td className="py-2 px-4 border-b text-gray-700">
                  {editId === publisher.id ? (
                    <input
                      type="text"
                      value={editPublisherData.name || ""}
                      onChange={(e) => handleEditChange(e, "name")}
                      className="border rounded w-full p-1"
                    />
                  ) : (
                    publisher.name
                  )}
                </td>
                <td className="py-2 px-4 border-b text-gray-700">{publisher.books?.length || 0}</td>
                <td className="py-2 px-4 border-b text-gray-700">
                  {editId === publisher.id ? (
                    <input
                      type="text"
                      value={editPublisherData.address || ""}
                      onChange={(e) => handleEditChange(e, "address")}
                      className="border rounded w-full p-1"
                    />
                  ) : (
                    publisher.address
                  )}
                </td>
                <td className="py-2 px-4 border-b text-gray-700 flex gap-2">
                  {editId === publisher.id ? (
                    <button
                      onClick={() => saveEdit(publisher.id)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Lưu
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(publisher)}
                      className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md"
                    >
                      Điều chỉnh
                    </button>
                  )}
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
              className={`px-4 py-2 rounded-md ${currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
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
