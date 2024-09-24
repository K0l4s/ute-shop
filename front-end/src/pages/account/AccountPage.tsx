import React, { useState } from 'react';
import Account from './Account';
import Address from './Address';
import Orders from './Order';
import FavoriteBooks from './FavoriteBooks';
import PurchasedBooks from './PurchasedBooks';

const AccountPage = () => {
  // State to keep track of which section is selected
  const [selectedSection, setSelectedSection] = useState('account'); // Default section

  // Function to render the corresponding component based on the selected option
  const renderSection = () => {
    switch (selectedSection) {
      case 'account':
        return <Account />;
      case 'address':
        return <Address />;
      case 'orders':
        return <Orders />;
      case 'favoriteBooks':
        return <FavoriteBooks />;
      case 'purchasedBooks':
        return <PurchasedBooks />;
      default:
        return <Account />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 p-6 h-auto">
        <h2 className="text-xl font-bold mb-4">Tài khoản của tôi</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setSelectedSection('account')}
              className={`w-full text-left py-2 px-4 ${selectedSection === 'account' ? 'bg-gray-300' : ''}`}
            >
              Thông tin tài khoản
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedSection('address')}
              className={`w-full text-left py-2 px-4 ${selectedSection === 'address' ? 'bg-gray-300' : ''}`}
            >
              Sổ địa chỉ
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedSection('orders')}
              className={`w-full text-left py-2 px-4 ${selectedSection === 'orders' ? 'bg-gray-300' : ''}`}
            >
              Đơn hàng của tôi
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedSection('favoriteBooks')}
              className={`w-full text-left py-2 px-4 ${selectedSection === 'favoriteBooks' ? 'bg-gray-300' : ''}`}
            >
              Sách yêu thích
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedSection('purchasedBooks')}
              className={`w-full text-left py-2 px-4 ${selectedSection === 'purchasedBooks' ? 'bg-gray-300' : ''}`}
            >
              Sách đã mua
            </button>
          </li>
        </ul>
      </div>

      {/* Main content (render selected section) */}
      <div className="w-4/5 p-6">
        {renderSection()} {/* This will render the component based on the selected section */}
      </div>
    </div>
  );
};

export default AccountPage;
