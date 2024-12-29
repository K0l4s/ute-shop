import { FaRegUserCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/reducers/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Menu from '../menu/Menu';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { AnimatePresence, motion } from 'framer-motion';
import Notification from '../socket/Notification';
import { BASE_URL } from '../../apis/base';

const AdminNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openNoti, setOpenNoti] = useState(false);
    const { unreadCount, fetchNotifications, clearNotifications } = useWebSocket();
    const [activeCategory] = useState<string>('');
    const [isVisible] = useState<boolean>(false);

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const firstname = useSelector((state: RootState) => state.auth.user?.firstname);

    const handleLogout = async () => {
        try {
            const response = await fetch(BASE_URL + '/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                dispatch(logout());
                navigate('/login');
                localStorage.clear();
                clearNotifications();
            } else {
                throw new Error('Logout failed');
            }
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    useEffect(() => {
        fetchNotifications(10, 0);
        localStorage.setItem('notificationOffset', '0');
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md border-b border-white/10 py-2 px-8 shadow-xl">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <Link to="#" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                        Admin Dashboard
                    </Link>
                </div>

                <div>
                    {isAuthenticated ? (
                        <div className='flex items-center gap-4'>
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
                                        <Notification />
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="relative group">
                                <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                                    <span className="text-white font-medium">Welcome, {firstname}</span>
                                    <FaRegUserCircle size={30} className="text-white group-hover:text-violet-700" />
                                </div>

                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                    <div className="py-1">
                                        <Link 
                                            to="/account/profile" 
                                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            My Account
                                        </Link>
                                        <Link 
                                            to="/" 
                                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            Customer View
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link 
                                to="/login" 
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="px-4 py-2 text-sm font-medium text-blue-400 bg-transparent rounded-md border border-blue-400 hover:bg-blue-400/10 transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Menu activeCategory={activeCategory} isVisible={isVisible} />
        </nav>
    );
};

export default AdminNavbar;
