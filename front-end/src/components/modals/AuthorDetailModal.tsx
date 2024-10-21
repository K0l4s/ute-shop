import React from 'react';

// Interface for Author
interface Author {
    id: number;
    name: string;
    description: string;
    books: { id: number; title: string }[]; // Danh sách sách của tác giả
}

interface AuthorDetailModalProps {
    author: Author;
    onClose: () => void;
}

const AuthorDetailModal: React.FC<AuthorDetailModalProps> = ({ author, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl mb-4">{author.name}</h2>
                <p className="mb-4">{author.description}</p>
                <h3 className="text-xl mb-2">Sách đã xuất bản:</h3>
                <ul className="list-disc pl-5">
                    {author.books.map((book) => (
                        <li key={book.id}>{book.title}</li>
                    ))}
                </ul>
                <div className="flex justify-end">
                    <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthorDetailModal;
