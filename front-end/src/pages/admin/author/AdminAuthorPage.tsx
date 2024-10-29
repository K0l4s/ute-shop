import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AuthorModal from '../../../components/modals/AuthorModal';
import AuthorDetailModal from '../../../components/modals/AuthorDetailModal';
import { getAllAuthors } from '../../../apis/author';

// Interface for Author
interface Author {
    id: number;
    name: string;
    // description: string;
    book_count: number;
    // books: { id: number; title: string }[]; 
}

const AdminAuthorPage: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([
        // { id: 1, name: 'Author 1', description: 'Description 1', book_count: 10, books: [{ id: 1, title: 'Book A' }, { id: 2, title: 'Book B' }] },
        // { id: 2, name: 'Author 2', description: 'Description 2', book_count: 20, books: [{ id: 3, title: 'Book C' }, { id: 4, title: 'Book D' }] },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

    // Handle opening modal
    const openModal = (author: Author | null) => {
        setSelectedAuthor(author);
        setIsModalOpen(true);
    };

    // Handle opening detail modal
    const openDetailModal = (author: Author) => {
        setSelectedAuthor(author);
        setIsDetailModalOpen(true);
    };

    // Handle closing modals
    const closeModal = () => {
        setSelectedAuthor(null);
        setIsModalOpen(false);
        setIsDetailModalOpen(false);
    };

    // Handle form submission (create or update)
    const handleFormSubmit = (newAuthor: Author) => {
        if (selectedAuthor) {
            // Update existing author
            setAuthors(authors.map((author) => (author.id === newAuthor.id ? newAuthor : author)));
        } else {
            // Create new author
            setAuthors([...authors, { ...newAuthor, id: authors.length + 1,
                //  books: [] 
                }]); // Khởi tạo sách rỗng
        }
        closeModal();
    };

    // Handle delete author
    const handleDelete = (id: number) => {
        setAuthors(authors.filter((author) => author.id !== id));
    };

    useEffect(() => {
        const fetchAuthors = async () => {
            const data = await getAllAuthors();
            console.log(data);
            setAuthors(data);
        }
        fetchAuthors();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Quản lý tác giả</h1>
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded flex items-center mb-4"
                onClick={() => openModal(null)}
            >
                <FaPlus className="mr-2" /> Thêm tác giả mới
            </button>
            <table className="min-w-full bg-white">
                <thead>
                    <tr className='bg-blue-600 text-white'>
                    <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Tên tác giả</th>
                        {/* <th className="py-2">Mô tả</th> */}
                        <th className="border px-4 py-2">Tổng số sách đã viết</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {authors.map((author) => (
                        <tr key={author.id}>
                            <td className="border px-4 py-2">{author.id}</td>
                            <td className="border px-4 py-2">{author.name}</td>
                            {/* <td className="border px-4 py-2">{author.description}</td> */}
                            <td className="border px-4 py-2">{author.book_count}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                    onClick={() => openDetailModal(author)}
                                >
                                    <FaEye />
                                </button>
                                <button
                                    className="text-yellow-500 hover:text-yellow-700 mr-2"
                                    onClick={() => openModal(author)}
                                >
                                    <FaEdit />
                                </button>

                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDelete(author.id)}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for create/update */}
            {isModalOpen && (
                <AuthorModal
                    author={selectedAuthor}
                    onClose={closeModal}
                    onSubmit={handleFormSubmit}
                />
            )}

            {/* Modal for author details */}
            {isDetailModalOpen && selectedAuthor && (
                <AuthorDetailModal
                    author={selectedAuthor}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default AdminAuthorPage;
