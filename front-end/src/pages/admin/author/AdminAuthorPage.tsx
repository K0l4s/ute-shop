import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { createAuthor, getAllAuthors } from '../../../apis/author';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

import { showToast } from '../../../utils/toastUtils';
import { BsSearch } from 'react-icons/bs';

interface basicAuthor {
    id: number,
    name: string,
};
interface Author extends basicAuthor {
    book_count: number;
}


const AdminAuthorPage: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [authorsPerPage] = useState(8);

    const [newAuthorModal, setNewAuthorModal] = useState<basicAuthor>({ id: 0, name: '' });

    const handleNewAuthor = async () => {
        if (!newAuthorModal.name.trim()) {
            showToast('Tên tác giả không được để trống!', 'error');
            return;
        }
    
        try {
            const res = await createAuthor({ name: newAuthorModal.name });
            setNewAuthorModal({ id: 0, name: '' });
            const newAuthor = { ...res };
            setAuthors((prevAuthors) => [...prevAuthors, newAuthor]);
            setFilteredAuthors((prevFilteredAuthors) => [...prevFilteredAuthors, newAuthor]);
            showToast('Thêm tác giả ' + res.name + ' thành công', 'success');
        } catch (err) {
            console.error(err);
            showToast('Thêm tác giả thất bại', 'error');
        }
    };

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const data = await getAllAuthors();
                setAuthors(data);
                setFilteredAuthors(data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu tác giả:', error);
            }
        };
        fetchAuthors();
    }, []);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = authors.filter((author) =>
            author.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredAuthors(filtered);
    };

    
    const indexOfLastAuthor = currentPage * authorsPerPage;
    const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
    const currentAuthors = filteredAuthors.slice(indexOfFirstAuthor, indexOfLastAuthor);
    const totalPages = Math.ceil(filteredAuthors.length / authorsPerPage);

    return (
        <div className="p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-white text-center">Quản lý tác giả</h1>

            {/* Search bar */}
            <div className="mb-6 max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Tìm kiếm tác giả..."
                        className="w-full px-6 py-3 rounded-full border-2 border-blue-300/30 bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                    />
                    <BsSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 animate-pulse" size={20} />
                </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden border border-white/20 hover:border-blue-400/30 transition-colors duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3">
                    {/* Card thêm mới */}
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg rounded-xl border border-blue-400/30">
                        <h3 className="text-lg font-semibold mb-4">Thêm tác giả mới</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Tên tác giả:</label>
                                <input
                                    type="text"
                                    value={newAuthorModal.name}
                                    onChange={(e) => setNewAuthorModal({ ...newAuthorModal, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/10 border border-blue-300/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
                                    placeholder="Nhập tên tác giả mới..."
                                />
                            </div>
                            <button
                                onClick={handleNewAuthor}
                                className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                                <FaPlus size={16} className="inline animate-pulse" /> Thêm mới
                            </button>
                        </div>
                    </div>

                    {/* Cards cho mỗi tác giả */}
                    {currentAuthors.map((author) => (
                        <div
                            key={author.id}
                            className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg rounded-xl border border-blue-400/30 hover:shadow-xl transition-shadow duration-300"
                        >
                            <h3 className="text-lg font-semibold mb-2">ID: {author.id}</h3>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm">Tên tác giả:</label>
                                    <p>{author.name}</p>
                                </div>
                                <p>
                                    <strong>Số sách:</strong> {author.book_count}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center items-center gap-6 mt-8">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
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
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${currentPage === totalPages
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                        }`}
                >
                    <span>Tiếp</span>
                    <BiRightArrow className="animate-pulse" />
                </button>
            </div>
        </div>
    );
};

export default AdminAuthorPage;
