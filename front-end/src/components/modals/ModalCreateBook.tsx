// src/components/ModalCreateBook.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { createBook } from '../../apis/book';

const ModalCreateBook: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [ISBN, setISBN] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [salePrice, setSalePrice] = useState<number | ''>('');
    const [year, setYear] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [stock, setStock] = useState<number | ''>('');
    const [coverImg, setCoverImg] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setCoverImg(event.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {

            try {
                await createBook(
                    ISBN,
                    title,
                    desc,
                    Number(price),
                    Number(salePrice),
                    new Date(year),
                    Number(age),
                    Number(stock),
                    coverImg ? coverImg : null
                ).then((response) => {
                    console.log(response);
                    return response.data;
                }
                );

            } catch (err) {
                console.error('Something went wrong: ', err);
            }

            alert('Book created successfully!');
            onClose();
        } catch (error) {
            console.error('Error creating book:', error);
            alert('Failed to create book');
        } finally {
            setUploading(false);
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 text-black">
            <div className="bg-white p-6 rounded shadow-md overflow-y-auto mt-12">
                <h2 className="text-lg font-semibold mb-4">Create New Book</h2>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-3 text-black gap-5'>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">ISBN</label>
                            <input
                                type="text"
                                value={ISBN}
                                onChange={(e) => setISBN(e.target.value)}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Tiêu đề</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Mô tả sách</label>
                            <textarea
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Giá</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Giảm giá</label>
                            <input
                                type="number"
                                value={salePrice}
                                onChange={(e) => setSalePrice(Number(e.target.value))}
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Năm xuất bản</label>
                            <input
                                type="date"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Quy định độ tuổi</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Nhập kho (quyển)</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(Number(e.target.value))}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Ảnh bìa</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="border rounded w-full p-2"
                                accept="image/*"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2 w-full"
                        disabled={uploading}
                    >
                        {uploading ? 'Đang tạo sách...' : 'Tạo sách'}
                    </button>
                    <button
                        type="button"
                        className="mt-2 text-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalCreateBook;
