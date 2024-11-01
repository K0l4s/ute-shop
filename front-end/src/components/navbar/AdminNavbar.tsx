// import React, { useState } from 'react';
// import logo from '../../assets/images/logo.png'
// import { TbLockAccess, TbLockAccessOff } from 'react-icons/tb'
// import { SiAwssecretsmanager } from "react-icons/si";
// import { BiSearch } from 'react-icons/bi';
// import { BsMenuButtonWideFill } from 'react-icons/bs';
import { FaRegUserCircle } from 'react-icons/fa';
// import { FiShoppingCart } from 'react-icons/fi';
// import { IoMdNotificationsOutline } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/reducers/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Menu from '../menu/Menu';
import { useState } from 'react';
const AdminNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeCategory] = useState<string>('');
    const [isVisible] = useState<boolean>(false);

    // const [searchQuery, setSearchQuery] = useState<string>('');
    // const handleCategoryClick = (category: string) => {
    //     setActiveCategory(category);
    //     setIsVisible(!isVisible); // Toggle visibility when clicking on the category
    // };
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    // const isAdmin = true;

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/logout', {
                method: 'POST',
                credentials: 'include', // Gửi cookie kèm theo
            });

            if (response.ok) {
                // Nếu logout thành công, cập nhật trạnhttp://uteshop.local:3000/account/profileg thái trong Redux
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
    const firstname = useSelector((state: RootState) => state.auth.user?.firstname);

    return (
        // navbar using tailwindcss
        <>
            <nav className="bg-white/10 backdrop-blur-md border border-white/20 p-1 sticky top-0 z-80 shadow-lg">
                <div className="justify-between mx-auto flex items-center">
                    <div className='justify-between flex items-center'>
                        {/* <img className='h-10 mr-20' src={logo} alt="" /> */}
                    </div>
                    <div>
                        {isAuthenticated ? (
                            <div>
                                <ul className="flex space-x-4">
                                    {/* User icon with dropdown menu */}
                                    <li className="relative group">
                                        <Link className='flex items-center' to="/account/profile">
                                            <p className='mr-2 font-bold text-white'>Xin chào, {firstname}</p>
                                            <div className="py-2">

                                                <FaRegUserCircle size={34} className="text-white cursor-pointer" />
                                            </div>

                                        </Link>

                                        {/* Dropdown menu */}
                                        <div className="absolute right-0 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block">
                                            <Link to="/account/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-t-lg">
                                                Tài khoản của tôi
                                            </Link>
                                            <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                                Customer View
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
                <Menu activeCategory={activeCategory} isVisible={isVisible} />
            </nav>


        </>
    )
}

export default AdminNavbar
