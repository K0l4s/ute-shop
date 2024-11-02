import React, { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png'
// import { TbLockAccess, TbLockAccessOff } from 'react-icons/tb'
// import { SiAwssecretsmanager } from "react-icons/si";
import { BiSearch } from 'react-icons/bi';
import { BsMenuButtonWideFill } from 'react-icons/bs';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/reducers/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Menu from '../menu/Menu';
import Notification from '../socket/Notification';
import { AnimatePresence, motion } from 'framer-motion';
import { useWebSocket } from '../../context/WebSocketContext';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openNoti, setOpenNoti] = useState(false);
  const [openAcc, setOpenAcc] = useState(false);
  const { setUnreadCount, unreadCount, fetchNotifications } = useWebSocket();

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setIsVisible(!isVisible); // Toggle visibility when clicking on the category
  };
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  // const isAdmin = true;
  // const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include', // Gửi cookie kèm theo
      });

      if (response.ok) {
        // Nếu logout thành công, cập nhật trạng thái trong Redux
        dispatch(logout());
        localStorage.removeItem('userData');
        alert('Đăng xuất thành công!');
        // Có thể điều hướng về trang đăng nhập hoặc trang chủ
        navigate('/login');
      } else {
        alert('Đăng xuất thất bại!');
      }
    } catch (err) {
      console.error('Có lỗi xảy ra khi đăng xuất:', err);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery.trim()}&page=1`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  useEffect(() => {
    fetchNotifications(10, 0);
    localStorage.setItem('notificationOffset', '0');
  }, []);

  return (
    // navbar using tailwindcss
    <>
      <nav className="bg-gray-800 p-4 sticky top-0 z-80">
        <div className="justify-between mx-auto flex items-center">
          <div className='justify-between flex items-center gap-10'>
            <Link to="/">
              <img className='w-20 ml-5' src={logo} alt="" />
            </Link>
            <BsMenuButtonWideFill onClick={() => handleCategoryClick('Sách trong nước')} size={30} className='mr-2' color='white' />
            {/* searchBox */}
            <div className="flex items-center w-100">
              <input
                type="text"
                placeholder="Search"
                className="bg-white p-1 h-8 rounded-l-lg w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown} />
              <button onClick={handleSearch} className="bg-white p-1 h-8 rounded-r-lg"><BiSearch size={24} /></button>
            </div>
          </div>
          <div className="flex items-center">
            <ul className="flex space-x-4">
              <li><Link to="/book" className="text-white">Sách</Link></li>
              <li><Link to="/publisher" className="text-white">Nhà xuất bản</Link></li>
              <li><Link to="/about" className="text-white">Về chúng tôi</Link></li>
              <li><Link to="/contact"className="text-white">Voucher</Link></li>
            </ul>
          </div>
          <div>
            {isAuthenticated ? (
              <div>
                <ul className="flex space-x-4 items-center">
                  <li>
                    {/* Notification Icon with Dropdown */}
                    <div
                      onMouseEnter={() => {
                        setOpenNoti(true);
                      }}
                      onMouseLeave={() => {
                        setOpenNoti(false);
                      }}
                      className="relative group w-fit h-fit py-2 cursor-pointer"
                    >
                      <IoMdNotificationsOutline size={34} className='text-white group-hover:text-violet-700' />

                      {/* Unread notification count */}
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white rounded-full text-sm flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                      <AnimatePresence>
                        {openNoti && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 8 }}
                            exit={{ opacity: 0, y: 15 }}
                            style={{ translateX: "-90%", willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right rounded-lg shadow-lg group-hover:block"
                          >
                            <Notification setUnreadCount={setUnreadCount} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </li>
                  <li>
                    <Link to="/cart" className="text-white">
                      <div className="py-2">
                        <FiShoppingCart size={34} className='hover:text-violet-700' />
                      </div>
                    </Link>
                  </li>
                  {/* User icon with dropdown menu */}
                  <li className="relative group">
                    <div
                      onMouseEnter={() => {
                        setOpenAcc(true);
                      }}
                      onMouseLeave={() => {
                        setOpenAcc(false);
                      }}
                      className="relative group w-fit h-fit py-2 cursor-pointer"
                    >
                      <FaRegUserCircle size={34} className='text-white group-hover:text-violet-700' />
                      <AnimatePresence>
                        {openAcc && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 8 }}
                            exit={{ opacity: 0, y: 15 }}
                            style={{ translateX: "-50%", willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 bg-white rounded-lg shadow-lg group-hover:block"
                          >
                            {/* Dropdown menu */}
                            <div className="absolute right-0 w-48 backdrop-blur-md bg-white/50 border-white/20 rounded-lg shadow-lg group-hover:block">
                              <Link to="/account/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-t-lg">
                                Tài khoản của tôi
                              </Link>
                              <Link to="/account/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                Đơn hàng của tôi
                              </Link>
                              <Link to="/account/favorites" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                Sách yêu thích
                              </Link>
                              {role === 'admin' && (
                                <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                  Admin Management
                                </Link>
                              )}
                              <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-rose-600 font-bold hover:bg-gray-200 rounded-md"
                              >
                                Đăng xuất
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-md hover:bg-purple-600 hover:text-white transition duration-300">
                  Login
                </Link>
                <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
        <Menu activeCategory={activeCategory} isVisible={isVisible} />
      </nav>


    </>
  )
}

export default Navbar
