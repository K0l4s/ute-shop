import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSortUp, FaSortDown, FaPlus } from 'react-icons/fa';
import { createAuthor, getAllAuthors, updateAuthor } from '../../../apis/author';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

import { showToast } from '../../../utils/toastUtils';

interface basicAuthor {
    id: number,
    name: string,
};
interface Author extends basicAuthor {
    book_count: number;
    isEditing?: boolean; // Trạng thái chỉnh sửa
}



type SortOrder = 'asc' | 'desc';

const AdminAuthorPage: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]); // Trạng thái cho danh sách tác giả đã lọc
    const [searchTerm, setSearchTerm] = useState<string>(''); // Trạng thái tìm kiếm
    const [sortField, setSortField] = useState<keyof Author | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [authorsPerPage] = useState(8);

    const [newAuthorModal, setNewAuthorModal] = useState<basicAuthor>({ id: 0, name: '' });

    const handleNewAuthor = async () => {
        await createAuthor({ name: newAuthorModal.name }).then((res) => {
            setNewAuthorModal({ id: 0, name: '' });
            console.log(res);
            setAuthors([...authors, res]);
            setFilteredAuthors([...filteredAuthors, res]);
            showToast('Thêm tác giả ' + res.name + ' thành công', 'success');
        })
            .catch((err) => {
                console.log(err);
                showToast('Thêm tác giả thất bại', 'error');
            });


    }



    // Thêm trạng thái tạm thời cho dữ liệu đang chỉnh sửa
    const [editedName, setEditedName] = useState<string>('');

    useEffect(() => {
        const fetchAuthors = async () => {
            const data = await getAllAuthors();
            setAuthors(data);
            setFilteredAuthors(data); // Khởi tạo danh sách lọc ban đầu là tất cả tác giả
        };
        fetchAuthors();
    }, []);

    // Hàm lọc tác giả theo tên
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        const filtered = authors.filter((author) =>
            author.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredAuthors(filtered); // Cập nhật danh sách tác giả đã lọc
    };

    const handleSort = (field: keyof Author) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);

        const sortedAuthors = [...filteredAuthors].sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];

            if (aValue === undefined || bValue === undefined) return 0;

            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredAuthors(sortedAuthors);
    };

    const handleEditToggle = (author: Author) => {
        setAuthors((prevAuthors) =>
            prevAuthors.map((item) =>
                item.id === author.id ? { ...item, isEditing: !item.isEditing } : item
            )
        );

        if (!author.isEditing) {
            setEditedName(author.name);
        }
    };

    const handleSave = async (id: number) => {
        await updateAuthor({ id, name: editedName });
        setAuthors((prevAuthors) =>
            prevAuthors.map((author) =>
                author.id === id
                    ? { ...author, name: editedName, isEditing: false }
                    : author
            )
        );
    };

    const handleDelete = (id: number) => {
        setAuthors(authors.filter((author) => author.id !== id));
        setFilteredAuthors(filteredAuthors.filter((author) => author.id !== id));
    };

    const indexOfLastAuthor = currentPage * authorsPerPage;
    const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
    const currentAuthors = filteredAuthors.slice(indexOfFirstAuthor, indexOfLastAuthor);

    const totalPages = Math.ceil(filteredAuthors.length / authorsPerPage);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-6">Quản lý tác giả</h1>
            {/* Tìm kiếm tác giả */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Tìm tác giả theo tên"
                    className="px-4 py-2 border rounded-md w-full"
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-blue-500 text-white uppercase text-xs font-semibold">
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
                                Số sách
                                {sortField === 'book_count' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                            </th>
                            <th className="px-6 py-3">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-blue-100">
                            <td className="px-6 py-4">Thêm mới</td>
                            <td className="px-6 py-4">
                                <input
                                    type="text"
                                    value={newAuthorModal.name}
                                    onChange={(e) => setNewAuthorModal({ ...newAuthorModal, name: e.target.value })}
                                    className="border rounded px-2"
                                />
                            </td>
                            <td className="px-6 py-4">0</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={handleNewAuthor}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <FaPlus />
                                </button>
                            </td>
                        </tr>
                        {currentAuthors.map((author) => (
                            <tr key={author.id} className="border-b hover:bg-blue-200">
                                <td className="px-6 py-4">{author.id}</td>
                                <td className="px-6 py-4">
                                    {author.isEditing ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="border rounded px-2"
                                        />
                                    ) : (
                                        author.name
                                    )}
                                </td>
                                <td className="px-6 py-4">{author.book_count}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    {author.isEditing ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(author.id)}
                                                className="text-green-500 hover:text-green-700"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={() => handleEditToggle(author)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FaTimes />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEditToggle(author)}
                                                className="text-yellow-500 hover:text-yellow-700"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(author.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded-md`}
                >
                    <BiLeftArrow />
                </button>
                <span className="text-white">
                    Trang {currentPage}/{totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded-md`}
                >
                    <BiRightArrow />
                </button>
            </div>
        </div>
    );
};

export default AdminAuthorPage;
