import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSortUp, FaSortDown } from 'react-icons/fa';
import AuthorModal from '../../../components/modals/AuthorModal';
import AuthorDetailModal from '../../../components/modals/AuthorDetailModal';
import { getAllAuthors } from '../../../apis/author';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

interface Author {
    id: number;
    name: string;
    book_count: number;
}

type SortOrder = 'asc' | 'desc';

const AdminAuthorPage: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [sortField, setSortField] = useState<keyof Author | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    
    // Thêm các trạng thái cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [authorsPerPage] = useState(8); // Số lượng tác giả trên mỗi trang

    const openModal = (author: Author | null) => {
        setSelectedAuthor(author);
        setIsModalOpen(true);
    };

    const openDetailModal = (author: Author) => {
        setSelectedAuthor(author);
        setIsDetailModalOpen(true);
    };

    const closeModal = () => {
        setSelectedAuthor(null);
        setIsModalOpen(false);
        setIsDetailModalOpen(false);
    };

    const handleFormSubmit = (newAuthor: Author) => {
        if (selectedAuthor) {
            setAuthors(authors.map((author) => (author.id === newAuthor.id ? newAuthor : author)));
        } else {
            setAuthors([...authors, { ...newAuthor, id: authors.length + 1 }]);
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        setAuthors(authors.filter((author) => author.id !== id));
    };

    useEffect(() => {
        const fetchAuthors = async () => {
            const data = await getAllAuthors();
            setAuthors(data);
        };
        fetchAuthors();
    }, []);

    const handleSort = (field: keyof Author) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);

        const sortedAuthors = [...authors].sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setAuthors(sortedAuthors);
    };

    // Tính toán chỉ số bắt đầu và kết thúc của tác giả trên trang hiện tại
    const indexOfLastAuthor = currentPage * authorsPerPage;
    const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
    const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);

    // Tính tổng số trang
    const totalPages = Math.ceil(authors.length / authorsPerPage);

    // Hàm để chuyển trang
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-6 text-white">Quản lý tác giả</h1>

            <button onClick={() => openModal(null)} className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md mb-5">
                <FaPlus className="mr-2" /> Thêm mới</button>

            <div className="
            bg-white
            shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-blue-500 text-white uppercase text-xs font-semibold text-black">
                        <tr>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('id')}>
                                ID
                                {sortField === 'id' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>
                                Tên tác giả
                                {sortField === 'name' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('book_count')}>
                                Số sách trên trang
                                {sortField === 'book_count' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-6 py-3">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAuthors.map((author) => (
                            <tr key={author.id} className="border-b border-size-2 hover:text-black hover:bg-blue-200">
                                <td className="px-6 py-4 ">{author.id}</td>
                                <td className="px-6 py-4 font-medium">{author.name}</td>
                                <td className="px-6 py-4 ">{author.book_count}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button className="text-blue-500 hover:text-blue-700" onClick={() => openDetailModal(author)}>
                                        <FaEye />
                                    </button>
                                    <button className="text-yellow-500 hover:text-yellow-700" onClick={() => openModal(author)}>
                                        <FaEdit />
                                    </button>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(author.id)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AuthorModal
                    author={selectedAuthor}
                    onClose={closeModal}
                    onSubmit={handleFormSubmit}
                />
            )}

            {isDetailModalOpen && selectedAuthor && (
                <AuthorDetailModal
                    author={selectedAuthor}
                    onClose={closeModal}
                />
            )}

            {/* Phân trang */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded-md`}
                >
                    <BiLeftArrow/>
                </button>
                <span className="text-white">
                    Trang {currentPage}/{totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded-md`}
                >
                    <BiRightArrow/>
                </button>
            </div>
        </div>
    );
};

export default AdminAuthorPage;
