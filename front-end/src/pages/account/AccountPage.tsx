import { useEffect, useState } from 'react';
import Account from './Account';
import Address from './Address';
import Orders from './Order';
import FavoriteBooks from './FavoriteBooks';
import PurchasedBooks from './PurchasedBooks';
import { Link, useLocation } from 'react-router-dom';

const AccountPage = () => {
  const location = useLocation();
  const [selectedSection, setSelectedSection] = useState('account');

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
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 h-auto md:h-auto overflow-auto"> {/* Thêm overflow-auto */}
        <div className="m-6 p-6 bg-gray-800 shadow-md rounded-lg">
          <h2 className="text-xl text-purple-700 font-bold mb-4">TÀI KHOẢN</h2>
          <ul className="space-y-4">
            <li>
              <Link to='/account/profile'>
                <button
                  onClick={() => setSelectedSection('account')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'account' ? 'bg-gray-600 font-bold' : ''}`}
                >
                  Thông tin tài khoản
                </button>
              </Link>
            </li>
            <li>
              <Link to='/account/address'>
                <button
                  onClick={() => setSelectedSection('address')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'address' ? 'bg-gray-600 font-bold' : ''}`}
                >
                  Địa chỉ của tôi
                </button>
              </Link>
            </li>
            <li>
              <Link to='/account/orders'> {/* Thêm Link */}
                <button
                  onClick={() => setSelectedSection('orders')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'orders' ? 'bg-gray-600 font-bold' : ''}`}
                >
                  Đơn hàng của tôi
                </button>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setSelectedSection('favoriteBooks')}
                className={`w-full text-left py-2 px-4 ${selectedSection === 'favoriteBooks' ? 'bg-gray-600 font-bold' : ''}`}
              >
                Sách yêu thích
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedSection('purchasedBooks')}
                className={`w-full text-left py-2 px-4 ${selectedSection === 'purchasedBooks' ? 'bg-gray-600 font-bold' : ''}`}
              >
                Sách đã mua
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main content (render selected section) */}
      <div className="w-full md:w-4/5 p-6 overflow-auto"> {/* Thêm overflow-auto để cuộn khi cần */}
        {renderSection()}
      </div>
    </div>
  );
};

export default AccountPage;
