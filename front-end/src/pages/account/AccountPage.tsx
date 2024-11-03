import { useEffect, useState } from 'react';
import Account from './Account';
import Address from './Address';
import Orders from './Order';
import FavoriteBooks from './FavoriteBooks';
import PurchasedBooks from './PurchasedBooks';
import { Link, useLocation } from 'react-router-dom';
import ViewHistory from './ViewHistory';
import { FaHistory, FaHome, FaUser } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { MdFavorite } from "react-icons/md";
import { LuPackageCheck } from "react-icons/lu";

const AccountPage = () => {
  window.scroll(1,1);
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
      case 'viewHistory':
        return <ViewHistory />
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
    } else if (location.pathname.includes("/account/viewHistory")) {
      setSelectedSection("viewHistory");
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 h-auto"> {/* Thêm overflow-auto */}
        <div className="m-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl text-purple-700 font-bold mb-4">TÀI KHOẢN</h2>
          <ul className="space-y-4">
            <li>
              <Link to='/account/profile'>
                <button
                  onClick={() => setSelectedSection('account')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'account' ? 'bg-gray-300 font-bold' : ''}`}
                >
                  <FaUser style={{display: "inline-block", marginBottom: "3px", marginRight: "5px"}}/>
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
                  <FaHome style={{display: "inline-block", marginBottom: "3px", marginRight: "5px"}} />
                  Địa chỉ của tôi
                </button>
              </Link>
            </li>
            <li>
              <Link to='/account/orders'> {/* Thêm Link */}
                <button
                  onClick={() => setSelectedSection('orders')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'orders' ? 'bg-gray-300 font-bold' : ''}`}
                >
                  <FiPackage style={{display: "inline-block", marginBottom: "3px", marginRight: "5px"}} />
                  Đơn hàng của tôi
                </button>
              </Link>
            </li>
            <li>
              <Link to='/account/favoriteBooks'>
                <button
                  onClick={() => setSelectedSection('favoriteBooks')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'favoriteBooks' ? 'bg-gray-300 font-bold' : ''}`}
                >
                  <MdFavorite style={{display: "inline-block", marginBottom: "3px", marginRight: "5px"}}/>
                  Sách yêu thích
                </button>
              </Link>
            </li>
            <li>
              <Link to='/account/purchasedBooks'>
                <button
                  onClick={() => setSelectedSection('purchasedBooks')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'purchasedBooks' ? 'bg-gray-300 font-bold' : ''}`}
                >
                  <LuPackageCheck style={{display: "inline-block", marginBottom: "3px", marginRight: "5px"}}/>
                  Sách đã mua
                </button>
              </Link>
            </li>
            <li>
              <Link to='/account/viewHistory'>
                <button
                  onClick={() => setSelectedSection('viewHistory')}
                  className={`w-full text-left py-2 px-4 ${selectedSection === 'viewHistory' ? 'bg-gray-300 font-bold' : ''}`}
                >
                  <FaHistory style={{display: "inline-block", marginBottom: "3px", marginRight: "5px"}} />
                  Lịch sử
                </button>
              </Link>
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
