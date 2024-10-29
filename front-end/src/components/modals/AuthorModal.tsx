import React, { useState, useEffect } from 'react';
import { createAuthor } from '../../apis/author';

// Interface for Author and Modal Props
interface Author {
    id: number;
    name: string;
    // description: string;
    book_count: number;
    // books: { id: number; title: string }[]; // Danh sách sách của tác giả
}

interface AuthorModalProps {
    author: Author | null;
    onClose: () => void;
    onSubmit: (author: Author) => void;
}

const AuthorModal: React.FC<AuthorModalProps> = ({ author, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    // const [description, setDescription] = useState('');

    useEffect(() => {
        if (author) {
            setName(author.name);
            // setDescription(author.description);
        } else {
            setName('');
            // setDescription('');
        }
    }, [author]);

    // Handle form submission
    const handleSubmit = async () => {
        const addAuthor = {
            name: name,
        };
        const res = await createAuthor(addAuthor);
        if (res) {
            const newAuthor = {
                id: author ? author.id : 0,
                name,
                // description,
                book_count: 0,
                books: [],
            };
            onSubmit(newAuthor);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl mb-4">{author ? 'Edit Author' : 'Add New Author'}</h2>

                {/* Name Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Description Input */}
                {/* <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        className="w-full px-3 py-2 border rounded"
                        // value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div> */}

                {/* Buttons */}
                <div className="flex justify-end">
                    <button className="bg-gray-500 text-white py-2 px-4 rounded mr-2" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSubmit}>
                        {author ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthorModal;
