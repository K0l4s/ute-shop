import { FaRegUserCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/reducers/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Menu from '../menu/Menu';
import { useState } from 'react';

const AdminNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeCategory] = useState<string>('');
    const [isVisible] = useState<boolean>(false);

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const firstname = useSelector((state: RootState) => state.auth.user?.firstname);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                dispatch(logout());
                navigate('/login');
            } else {
                throw new Error('Logout failed');
            }
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md border-b border-white/10 p-4 shadow-xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <Link to="/admin/dashboard" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                        Admin Dashboard
                    </Link>
                </div>

                <div>
                    {isAuthenticated ? (
                        <div className="relative group">
                            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                                <span className="text-white font-medium">Welcome, {firstname}</span>
                                <FaRegUserCircle size={30} className="text-white" />
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
