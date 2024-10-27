import { useEffect, useState } from 'react';
import Account from './Account';
import Address from './Address';
import Orders from './Order';
import FavoriteBooks from './FavoriteBooks';
import PurchasedBooks from './PurchasedBooks';
import { Link, useLocation } from 'react-router-dom';
const AccountPage = () => {
  const location = useLocation();
  

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
      case 'orders':
        return <Orders />;
      default:
        return <Account />;
    }
  };

  // Đồng bộ `selectedSection` với URL khi component được render hoặc URL thay đổi
  useEffect(() => {
    if (location.pathname.includes("/account/address")) {
      setSelectedSection("address");
    } else if (location.pathname.includes("/account/profile")) {
      setSelectedSection("account");
    } else if (location.pathname.includes("/account/orders")) {
      setSelectedSection("orders");
    } else if (location.pathname.includes("/account/favoriteBooks")) {
      setSelectedSection("favoriteBooks");
    } else if (location.pathname.includes("/account/purchasedBooks")) {
      setSelectedSection("purchasedBooks");
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 h-auto">
        <div className="m-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl text-purple-700 font-bold mb-4">TÀI KHOẢN</h2>
          <ul className="space-y-4">
            <li>
              <Link to='/account/profile'>
                <button
                  onClick={() => setSelectedSection('account')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'account' ? 'bg-gray-300 font-bold' : ''}`}
                >
                  Thông tin tài khoản
                </button>
              </Link>
            </li>
            <li>
              <Link to='/account/address'>
                <button
                  onClick={() => setSelectedSection('address')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'address' ? 'bg-gray-300 font-bold' : ''}`}
                >
                  Địa chỉ của tôi
                </button>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setSelectedSection('orders')}
                className={`w-full text-left py-2 px-4 ${selectedSection === 'orders' ? 'bg-gray-300 font-bold' : ''}`}
              >
                Đơn hàng của tôi
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedSection('favoriteBooks')}
                className={`w-full text-left py-2 px-4 ${selectedSection === 'favoriteBooks' ? 'bg-gray-300 font-bold' : ''}`}
              >
                Sách yêu thích
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedSection('purchasedBooks')}
                className={`w-full text-left py-2 px-4 ${selectedSection === 'purchasedBooks' ? 'bg-gray-300 font-bold' : ''}`}
              >
                Sách đã mua
              </button>
            </li>
          </ul>
        </div>
        
      </div>

      {/* Main content (render selected section) */}
      <div className="w-4/5 p-6">
        {renderSection()} {/* This will render the component based on the selected section */}
      </div>
    </div>
  );
};

export default AccountPage;
