import { useEffect, useState } from "react";
import { searchBooks } from "../../../apis/book";
// import { useLocation } from "react-router-dom";
import { FaEdit, FaEye, FaTrash, FaSortUp, FaSortDown, FaPlus } from "react-icons/fa";
import Pagination from "../../../components/pagination/Pagination";
import ModalCreateBook from "../../../components/modals/ModalCreateBook";
import Papa, { ParseResult } from 'papaparse';
import * as XLSX from 'xlsx';
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
interface BookData {
    isbn: string;
    quantity: number;
}

type SortOrder = 'asc' | 'desc';

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

    const [sortField, setSortField] = useState<keyof Book | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

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
                    limit: 16,
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
    }, [currentPage, filters]);

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

    const handleSort = (field: keyof Book) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);

        // Sort books based on the selected field and order
        const sortedBooks = [...books].sort((a, b) => {
            if (field === 'price' || field === 'salePrice' || field === 'stock' || field === 'total_sold') {
                return order === 'asc'
                    ? Number(a[field]) - Number(b[field])
                    : Number(b[field]) - Number(a[field]);
            }
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setBooks(sortedBooks);
    };
    const [isOpenCreateBook, setIsOpenCreateBook] = useState(false);
    const openModal = () => {
        setIsOpenCreateBook(true);
    }
    const closeModal = () => {
        setIsOpenCreateBook(false);
    }
    const importMultiBook = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv, .xlsx';
        
        fileInput.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
    
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
            // Handle CSV files
            if (fileExtension === 'csv') {
                Papa.parse<BookData>(file, {
                    header: true,
                    complete: (results: ParseResult<BookData>) => {
                        // Extract "isbn" and "quantity" columns
                        results.data.forEach((row: BookData) => {
                            console.log(`ISBN: ${row.isbn}, Quantity: ${row.quantity}`);
                        });
                    },
                    error: (error: Error) => {
                        console.error("Error parsing CSV:", error.message);
                    }
                });
            }
            // Handle XLSX files
            else if (fileExtension === 'xlsx') {
                const reader = new FileReader();
    
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json<BookData>(firstSheet);
    
                    // Extract "isbn" and "quantity" columns
                    jsonData.forEach((row: BookData) => {
                        console.log(`ISBN: ${row.isbn}, Quantity: ${row.quantity}`);
                    });
                };
    
                reader.onerror = (ev: ProgressEvent<FileReader>) => {
                    console.error("Error reading XLSX file:", ev.target?.error?.message);
                };
    
                reader.readAsArrayBuffer(file);
            } else {
                console.error("Unsupported file format");
            }
        };
    
        // Trigger file input dialog
        fileInput.click();
    };
    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-semibold mb-4">Quản lý sách</h1>

            {/* Filter Inputs */}
            {/* <h2 className="text-lg font-semibold mb-2">Lọc sách the</h2> */}
            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    name="title"
                    placeholder="Lọc sách theo tiêu đề"
                    className="border px-4 py-2 rounded-full w-10/12 bg-gradient-to-r from-violet-800 to-blue-900 border-none
                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:ring-opacity-50"

                    onChange={handleFilterChange}
                />
                <select
                    name="price"
                    onChange={handleFilterChange}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:ring-opacity-50 border px-4 py-2 rounded text-black bg-gradient-to-r from-violet-800 to-blue-900 text-white rounded-full border-none"
                >
                    <option value="" className="text-black">Tất cả các mức giá</option>
                    <option value="< 50.000" className="text-black">Thấp hơn 50,000</option>
                    <option value="50.000 - 100.000" className="text-black">50,000 - 100,000</option>
                    <option value="> 100.000" className="text-black">Lớn hơn 100,000</option>
                </select>

            </div>
            <h2 className="text-lg font-semibold mb-2">Thao tác</h2>
            <div className="flex flex-cols gap-3">
                <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-5" onClick={openModal}>
                    <FaPlus className="mr-2" />Thêm sách</button>
                <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-5" onClick={importMultiBook}>
                    <FaPlus className="mr-2" />Nhập hàng hàng loạt</button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full text-left text-sm text-gray-700 bg-gradient-to-r from-violet-800 to-blue-900 rounded-xl text-white">
                    <thead className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-lg text-black">
                        <tr>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('ISBN')}>
                                ISBN {sortField === 'ISBN' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4">Cover</th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('title')}>
                                Tiêu đề {sortField === 'title' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('Author')}>
                                Tác giả {sortField === 'Author' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('Publisher')}>
                                NXB {sortField === 'Publisher' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('price')}>
                                Giá {sortField === 'price' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('salePrice')}>
                                Giảm giá {sortField === 'salePrice' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('total_sold')}>
                                Bán {sortField === 'total_sold' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('stock')}>
                                Tồn kho {sortField === 'stock' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4">Trạng thái</th>
                            <th className="px-5 py-4">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* add new book components */}
                        {books.map((book) => (
                            <tr key={book.id} className="border-b hover:bg-gray-100 hover:text-black hover:opacity-80 cursor-pointer">
                                <td className="px-5 py-4 ">#{book.ISBN}</td>
                                <td className="px-5 py-4">
                                    <img src={book.cover_img_url} alt={book.title} className="h-12 object-fit object-cover rounded-lg shadow-5xl" />
                                </td>
                                <td className="px-5 py-4 ">{book.title}</td>
                                <td className="px-5 py-4 ">{book.Author?.name}</td>
                                <td className="px-5 py-4 ">{book.Publisher?.name}</td>
                                <td className="px-5 py-4 ">{formatMoney(Number(book.price))}</td>
                                <td className="px-5 py-4 ">{formatMoney(Number(book.salePrice))}</td>
                                <td className="px-5 py-4">{book.total_sold ? book.total_sold : "0"}</td>
                                <td className="px-5 py-4 ">{book.stock - Number(book.total_sold)}</td>
                                <td className="px-5 py-4 ">{Number(book.total_sold) < book.stock ?
                                    <p className="bg-green-200 rounded-xl p-1 text-black text-center">Còn hàng</p>
                                    :
                                    <p className="bg-red-200 rounded-xl p-1 text-center">Hết hàng</p>}</td>
                                <td className="px-5 py-4 flex items-center space-x-2">
                                    <button className="text-blue-500 hover:text-blue-700"><FaEye /></button>
                                    <button className="text-yellow-500 hover:text-yellow-700"><FaEdit /></button>
                                    <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            {isOpenCreateBook && <ModalCreateBook onClose={closeModal} />}
        </div>
    );
};

export default AdminProduct;
