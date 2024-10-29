import { useEffect, useState } from "react";
import { searchBooks } from "../../../apis/book";
// import { useLocation } from "react-router-dom";
import { FaEdit, FaEye, FaTrash, FaSortUp, FaSortDown, FaPlus } from "react-icons/fa";
import Pagination from "../../../components/pagination/Pagination";

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
    total_sold: number;
    year: number;
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

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-4">Product Management</h1>

            {/* Filter Inputs */}
            <h2 className="text-lg font-semibold mb-2">Filters</h2>
            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    name="title"
                    placeholder="Filter by Title"
                    className="border px-4 py-2 rounded w-10/12"
                    onChange={handleFilterChange}
                />
                <select name="price" onChange={handleFilterChange} className="border px-4 py-2 rounded">
                    <option value="">All Prices</option>
                    <option value="< 50.000">Less than 50,000</option>
                    <option value="50.000 - 100.000">50,000 - 100,000</option>
                    <option value="> 100.000">Greater than 100,000</option>
                </select>
            </div>
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            <div>
                <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-5"><FaPlus className="mr-2" /> Add New Book</button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('ISBN')}>
                                ISBN {sortField === 'ISBN' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4">Cover</th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('title')}>
                                Title {sortField === 'title' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('Author')}>
                                Author {sortField === 'Author' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('Publisher')}>
                                Publisher {sortField === 'Publisher' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('price')}>
                                Price {sortField === 'price' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('salePrice')}>
                                Sale Price {sortField === 'salePrice' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('total_sold')}>
                                Sold {sortField === 'total_sold' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort('stock')}>
                                Stock {sortField === 'stock' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* add new book components */}
                        {books.map((book) => (
                            <tr key={book.id} className="border-b hover:bg-gray-50">
                                <td className="px-5 py-4 text-gray-700">#{book.ISBN}</td>
                                <td className="px-5 py-4">
                                    <img src={book.cover_img_url} alt={book.title} className="h-12 object-fit object-cover" />
                                </td>
                                <td className="px-5 py-4 text-gray-700">{book.title}</td>
                                <td className="px-5 py-4 text-gray-700">{book.Author.name}</td>
                                <td className="px-5 py-4 text-gray-700">{book.Publisher.name}</td>
                                <td className="px-5 py-4 text-gray-700">{formatMoney(Number(book.price))}</td>
                                <td className="px-5 py-4 text-gray-700">{formatMoney(Number(book.salePrice))}</td>
                                <td className="px-5 py-4 text-gray-700">{book.total_sold}</td>
                                <td className="px-5 py-4 text-gray-700">{book.stock}</td>
                                <td className="px-5 py-4 text-gray-700">{book.total_sold < book.stock ?
                                    <p className="bg-green-200 rounded-xl p-1">Available</p>
                                    :
                                    <p className="bg-red-200 rounded-xl p-1">Sold out</p>}</td>
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
        </div>
    );
};

export default AdminProduct;
