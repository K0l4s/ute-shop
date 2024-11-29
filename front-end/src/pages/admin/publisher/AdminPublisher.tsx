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
            <input
              type="number"
              min="0"
              value={filters.minBooks}
              onChange={(e) => {
                const newMin = parseInt(e.target.value);
                setFilters((prev) => ({
                  ...prev,
                  minBooks: newMin,
                  maxBooks: Math.max(newMin, prev.maxBooks)
                }));
              }}
              className="px-4 py-2 bg-gray-700 text-white border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-300"
            />
            <span className="text-white font-bold">-</span>
            <input
              type="number"
              min={filters.minBooks}
              value={filters.maxBooks}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  maxBooks: parseInt(e.target.value),
                }));
              }}
              className="px-4 py-2 bg-gray-700 text-white border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={applyFilters}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Áp dụng bộ lọc
            </button>
          </div>

        </div>
      </div>



      {/* Bảng nhà xuất bản */}
      <div className="overflow-x-auto rounded-lg shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((publisher) => (
            <div
              key={publisher.id}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-4">ID: {publisher.id}</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white">Tên nhà xuất bản:</label>
                  {editId === publisher.id ? (
                    <input
                      type="text"
                      value={editPublisherData.name || ""}
                      onChange={(e) => handleEditChange(e, "name")}
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <p className="text-white">{publisher.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-300">Số lượng sách:</label>
                  <p className="text-gray-200">{publisher.books?.length || 0}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-300">Địa chỉ:</label>
                  {editId === publisher.id ? (
                    <input
                      type="text"
                      value={editPublisherData.address || ""}
                      onChange={(e) => handleEditChange(e, "address")}
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    <p className="text-gray-200">{publisher.address}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex space-x-4">
                {editId === publisher.id ? (
                  <button
                    onClick={() => saveEdit(publisher.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <FaCheck className="inline-block mr-2" />
                    Lưu
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(publisher)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <FaEdit className="inline-block mr-2" />
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="flex justify-center items-center gap-6 mt-8 mb-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${currentPage === 1
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
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${currentPage === Math.ceil(filteredPublishers.length / itemsPerPage)
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
