import React, {  useState } from 'react';
import { createPublisher } from '../../apis/publisher';
import { showToast } from '../../utils/toastUtils';



const ModalPublisher: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [uploading, setUploading] = useState(false);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const publisher = { name, address };
            await createPublisher(publisher);
            console.log('Book created:', publisher);
            // alert('Book created successfully!');
            showToast('Book created successfully!', 'success');
            onClose();
        } catch (error) {
            console.error('Error creating book:', error);
            showToast('Failed to create book', 'error');
            // alert('Failed to create book');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 text-black">
            <div className="bg-white p-6 rounded shadow-md overflow-y-auto mt-12">
                <h2 className="text-lg font-semibold mb-4">Tạo mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 text-black gap-5">
                        {/* Các trường input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Tên NXB</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Địa chỉ NXB</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2 w-full"
                        disabled={uploading}
                    >
                        {uploading ? 'Đang tạo sách...' : 'Tạo nhà xuất bản'}
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

export default ModalPublisher;
