import React, { useState, useEffect } from 'react';



interface AuthorModalProps {
    onClose: () => void;
}

const OrderConfigModal: React.FC<AuthorModalProps> = ({  onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">

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
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        className="w-full px-3 py-2 border rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end">
                    <button className="bg-gray-500 text-white py-2 px-4 rounded mr-2" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded" >
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfigModal;
