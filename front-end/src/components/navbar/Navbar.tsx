import React from 'react';
import logo from '../../assets/images/logo.png'
import { TbLockAccess, TbLockAccessOff } from 'react-icons/tb'
import { SiAwssecretsmanager } from "react-icons/si";
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

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAdmin = true;

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include', // Gửi cookie kèm theo
      });
  
      if (response.ok) {
        // Nếu logout thành công, cập nhật trạng thái trong Redux
        dispatch(logout());
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

  return (
    // navbar using tailwindcss
    <nav className="bg-gray-800 p-4 sticky top-0 ">
      <div className="justify-between mx-auto flex items-center">
        <div className='justify-between flex items-center'>
          <img className='h-10 mr-20' src={logo} alt="" />
          <BsMenuButtonWideFill size={30} className='mr-2' color='white' />
          {/* searchBox */}
          <div className="flex items-center w-100">
            <input type="text" placeholder="Search" className="bg-gray-900 p-1 h-8 rounded-l-lg w-80" />
            <button className="bg-gray-900 text-white p-1 h-8 rounded-r-lg"><BiSearch /></button>
          </div>
        </div>
        <div className="flex items-center">
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-white">Sách</Link></li>
            <li><Link to="/about" className="text-white">Nhà xuất bản</Link></li>
            <li><Link to="/contact" className="text-white">Về chúng tôi</Link></li>
            <li><Link to="/contact" className="text-white">Voucher</Link></li>
          </ul>
        </div>
        <div>
          {isAuthenticated ? (
            <div>
            <ul className="flex space-x-4">
              <li>
                <Link to="/cart" className="text-white">
                  <div className="py-2">
                    <IoMdNotificationsOutline size={34}/>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-white">
                  <div className="py-2">
                    <FiShoppingCart size={34}/>
                  </div>
                </Link>
              </li>
              {/* User icon with dropdown menu */}
              <li className="relative group">
                <Link to="/account">
                  <div className="py-2">
                    <FaRegUserCircle size={34} className="text-white cursor-pointer" />
                  </div>
                </Link>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block">
                  <Link to="/account" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-t-lg">
                    Tài khoản của tôi
                  </Link>
                  <Link to="/account/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Đơn hàng của tôi
                  </Link>
                  <Link to="/account/favorites" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Sách yêu thích
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-rose-600 font-bold hover:bg-gray-200 rounded-md"
                  >
                    Đăng xuất
                  </button>
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
    </nav>
  )
}

export default Navbar