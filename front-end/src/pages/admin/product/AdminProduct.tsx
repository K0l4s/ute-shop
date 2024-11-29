import { useEffect, useState } from "react";
import { searchBooks } from "../../../apis/book";
// import { useLocation } from "react-router-dom";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
// import Pagination from "../../../components/pagination/Pagination";
import ModalCreateBook from "../../../components/modals/ModalCreateBook";

interface Book {
    Author: { Id: number; name: string };
    ISBN: string;
    Images: string[];
    Publisher: { id: number; name: string; address: string };
    Reviews: [];
    age: number;
    author_id: number;
    category_id: number;
    cover_img_url: string;
    desc: string;
    genres: string[];
    id: number;
    price: string;
    publisher_id: number;
    salePrice: number;
    sold: number;
    sold_count: number;
    stock: number;
    title: string;
    total_sold: string;
    year: number;
}
const AdminProduct = () => {
    const [books, setBooks] = useState<Book[]>([]);
    // const location = useLocation();

    type Filters = {
        [key: string]: string | undefined;
        price?: string;
        publisher?: string;
        title?: string;
        author?: string;
        isbn?: string;
        stock?: string;
    };

    const [filters, setFilters] = useState<Filters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpenCreateBook, setIsOpenCreateBook] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                let minPrice, maxPrice;
                switch (filters.price) {
                    case '< 50.000':
                        minPrice = 0;
                        maxPrice = 50000;
                        break;
                    case '50.000 - 100.000':
                        minPrice = 50000;
                        maxPrice = 100000;
                        break;
                    case '> 100.000':
                        minPrice = 100000;
                        maxPrice = undefined;
                        break;
                    default:
                        minPrice = undefined;
                        maxPrice = undefined;
                }

                const params = {
                    ...filters,
                    title: filters.title || "", // Default to empty string if undefined
                    page: currentPage,
                    limit: 6,
                    minPrice: minPrice,
                    maxPrice: maxPrice,
                };

                const response = await searchBooks(params);
                setBooks(response.data);
                setCurrentPage(response.currentPage);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        };

        fetchBooks();
    }, [isOpenCreateBook, currentPage, filters]);

    const formatMoney = (value: number) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // const handleSort = (field: keyof Book) => {
    //     const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    //     setSortField(field);
    //     setSortOrder(order);

    //     // Sort books based on the selected field and order
    //     const sortedBooks = [...books].sort((a, b) => {
    //         if (field === 'price' || field === 'salePrice' || field === 'stock' || field === 'total_sold') {
    //             return order === 'asc'
    //                 ? Number(a[field]) - Number(b[field])
    //                 : Number(b[field]) - Number(a[field]);
    //         }
    //         if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
    //         if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
    //         return 0;
    //     });
    //     setBooks(sortedBooks);
    // };

    const openModal = () => {
        setIsOpenCreateBook(true);
    }
    const closeModal = () => {
        setIsOpenCreateBook(false);
    }
    // const importMultiBook = () => {
    //     const fileInput = document.createElement('input');
    //     fileInput.type = 'file';
    //     fileInput.accept = '.csv, .xlsx';

    //     fileInput.onchange = (e: Event) => {
    //         const file = (e.target as HTMLInputElement).files?.[0];
    //         if (!file) return;

    //         const fileExtension = file.name.split('.').pop()?.toLowerCase();

    //         // Handle CSV files
    //         if (fileExtension === 'csv') {
    //             Papa.parse<BookData>(file, {
    //                 header: true,
    //                 complete: (results: ParseResult<BookData>) => {
    //                     // Extract "isbn" and "quantity" columns
    //                     results.data.forEach((row: BookData) => {
    //                         console.log(`ISBN: ${row.isbn}, Quantity: ${row.quantity}`);
    //                     });
    //                 },
    //                 error: (error: Error) => {
    //                     console.error("Error parsing CSV:", error.message);
    //                 }
    //             });
    //         }
    //         // Handle XLSX files
    //         else if (fileExtension === 'xlsx') {
    //             const reader = new FileReader();

    //             reader.onload = (e) => {
    //                 const data = new Uint8Array(e.target?.result as ArrayBuffer);
    //                 const workbook = XLSX.read(data, { type: 'array' });
    //                 const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    //                 const jsonData = XLSX.utils.sheet_to_json<BookData>(firstSheet);

    //                 // Extract "isbn" and "quantity" columns
    //                 jsonData.forEach((row: BookData) => {
    //                     console.log(`ISBN: ${row.isbn}, Quantity: ${row.quantity}`);
    //                 });
    //             };

    //             reader.onerror = (ev: ProgressEvent<FileReader>) => {
    //                 console.error("Error reading XLSX file:", ev.target?.error?.message);
    //             };

    //             reader.readAsArrayBuffer(file);
    //         } else {
    //             console.error("Unsupported file format");
    //         }
    //     };

    //     // Trigger file input dialog
    //     fileInput.click();
    // };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-4 text-white">Quản lý sách</h1>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    name="title"
                    placeholder="Lọc sách theo tiêu đề..."
                    className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white border-none
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    placeholder-gray-400"
                    onChange={handleFilterChange}
                />
                <select
                    name="price"
                    onChange={handleFilterChange}
                    className="w-full md:w-auto px-4 py-2 rounded-full bg-gray-700 text-white border-none
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Tất cả các mức giá</option>
                    <option value="< 50.000">Dưới 50,000đ</option>
                    <option value="50.000 - 100.000">50,000đ - 100,000đ</option>
                    <option value="> 100.000">Trên 100,000đ</option>
                </select>
            </div>

            {/* Action Buttons */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-white">Thao tác</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={openModal}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                        hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                        <FaPlus className="mr-2" />Thêm sách mới
                    </button>
                    {/* <button
                        onClick={importMultiBook}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
                        hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                    >
                        <FaPlus className="mr-2" />Nhập hàng hàng loạt
                    </button> */}
                </div>
            </div>

            {/* Books Table */}
            <div className="bg-white/10 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out"
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={book.cover_img_url}
                                        alt={book.title}
                                        className="h-24 w-16 object-cover rounded-lg shadow-md"
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                                        <p className="text-sm text-gray-600">ISBN: #{book.ISBN}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-700 space-y-2">
                                    <p>
                                        <strong>Tác giả:</strong> {book.Author?.name || "N/A"}
                                    </p>
                                    <p>
                                        <strong>NXB:</strong> {book.Publisher?.name || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Giá:</strong> {formatMoney(Number(book.price))}
                                    </p>
                                    <p className="text-red-500">
                                        <strong>Giảm giá:</strong> {formatMoney(Number(book.salePrice))}
                                    </p>
                                    <p>
                                        <strong>Đã bán:</strong> {book.total_sold || "0"}
                                    </p>
                                    <p>
                                        <strong>Tồn kho:</strong> {book.stock - Number(book.total_sold)}
                                    </p>
                                    <p>
                                        <strong>Trạng thái:</strong>{" "}
                                        {Number(book.total_sold) < book.stock ? (
                                            <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm">
                                                Còn hàng
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
                                                Hết hàng
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="mt-4 flex space-x-3">
                                    <button
                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                        title="Xem chi tiết"
                                    >
                                        <FaEye size={16} />
                                    </button>
                                    <button
                                        className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                        title="Chỉnh sửa"
                                    >
                                        <FaEdit size={16} />
                                    </button>
                                    <button
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                        title="Xóa"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Pagination */}
            <div className="mt-6">
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${currentPage === 1
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-colors`}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded-lg ${currentPage === index + 1
                                    ? 'bg-blue-600'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                } text-white transition-colors`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-colors`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Create Book Modal */}
            {isOpenCreateBook && <ModalCreateBook onClose={closeModal} />}
        </div>
    );
};

export default AdminProduct;
