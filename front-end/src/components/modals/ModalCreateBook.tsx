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
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div className="bg-white rounded-2xl shadow-xl w-[80%] max-w-4xl max-h-[90vh] overflow-y-auto relative z-10">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Book</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">ISBN</label>
                                <input
                                    type="text"
                                    value={ISBN}
                                    onChange={(e) => setISBN(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                                <textarea
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Sale Price</label>
                                <input
                                    type="number"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Publication Year</label>
                                <input
                                    type="date"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Age Range</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Stock</label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Cover Image</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    accept="image/*"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Author</label>
                                <select
                                    value={selectedAuthor || ''}
                                    onChange={(e) => setSelectedAuthor(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                >
                                    <option value="">Select Author</option>
                                    {authorList.map((author) => (
                                        <option key={author.id} value={author.id}>{author.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Category</label>
                                <select
                                    value={selectedCategory || ''}
                                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                >
                                    <option value="">Select Category</option>
                                    {categoryList.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Publisher</label>
                                <select
                                    value={selectedPublisher || ''}
                                    onChange={(e) => setSelectedPublisher(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                >
                                    <option value="">Select Publisher</option>
                                    {publisherList.length > 0 && publisherList.map((pub) => (
                                        <option key={pub.id} value={pub.id}>{pub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Creating...' : 'Create Book'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateBook;
