import React, { useEffect, useState } from 'react';
import { createBook } from '../../apis/book';
import { getAllAuthors } from '../../apis/author';
import { getPublisher } from '../../apis/publisher';
// import { getAllCategories } from '../../apis/category'; // Giả sử hàm lấy danh sách thể loại

export interface Author {
    id: number;
    name: string;
}
export interface Category {
    id: number;
    name: string;
}
export interface Pub {
    id: number;
    name: string;
}
const ModalCreateBook: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [authorList, setAuthorList] = useState<Author[]>([]);
    const [publisherList, setPublisherList] = useState<Pub[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedPublisher, setSelectedPublisher] = useState<number | null>(null);

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
    // const [publisher, setPublisher] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                // const response = await getAllCategories();
                // setCategoryList(response);
            } catch (error) {
                console.error('Failed to fetch category:', error);
            }
        };

        const fetchAuthor = async () => {
            try {
                const response = await getAllAuthors();
                setAuthorList(response);
            } catch (error) {
                console.error('Failed to fetch author:', error);
            }
        };
        const fetchPublisher = async () => {
            try {
                const response = await getPublisher();
                console.log(response);
                setPublisherList(response.data);
            } catch (error) {
                console.error('Failed to fetch publisher:', error);
            }
        };

        fetchCategory();
        fetchAuthor();
        fetchPublisher();
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setCoverImg(event.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const newBook = await createBook(
                ISBN,
                title,
                desc,
                Number(price),
                Number(salePrice),
                new Date(year),
                Number(age),
                Number(stock),
                // selectedCategory,
                coverImg ? coverImg : null,
                selectedAuthor || 0,
                selectedPublisher || 0
            );
            console.log('Book created:', newBook);
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
                    <div className="grid grid-cols-3 text-black gap-5">
                        {/* Các trường input */}
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
                            <label className="block text-sm font-medium">Độ tuổi</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Kho sách</label>
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
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Tác giả</label>
                            <select
                                value={selectedAuthor || ''}
                                onChange={(e) => setSelectedAuthor(Number(e.target.value))}
                                className="border rounded w-full p-2"
                                required
                            >
                                <option value="">Chọn tác giả</option>
                                {authorList.map((author) => (
                                    <option key={author.id} value={author.id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Thể loại</label>
                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                                className="border rounded w-full p-2"
                            // required
                            >
                                <option value="">Chọn thể loại</option>
                                {categoryList.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Nhà xuất bản</label>
                            <select
                                value={selectedPublisher || ''}
                                onChange={(e) => setSelectedPublisher(Number(e.target.value))}
                                className="border rounded w-full p-2"
                            // required
                            >
                                <option value="">Chọn nhà xuất bản</option>
                                {publisherList.length>0 && publisherList.map((pub) => (
                                    <option key={pub.id} value={pub.id}>
                                        {pub.name}
                                    </option>
                                ))}
                            </select>
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
