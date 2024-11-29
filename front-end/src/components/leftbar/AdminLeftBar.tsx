import React from 'react';
import { FaTachometerAlt, FaUser, FaBoxOpen, FaShoppingCart, FaTags, FaBookOpen, FaLayerGroup, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MenuGroup from './MenuGroup';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { BiCalendarEvent } from 'react-icons/bi';
import { MdLocalOffer } from 'react-icons/md';

// Define the type for a submenu item
interface Submenu {
    title: string;
    link: string;
    icon: any;
}

const AdminLeftBar: React.FC = () => {
    // Define the structure of the submenus with more appropriate icons
    const productSubmenus: Submenu[] = [
        { title: 'Sách', link: '/admin/products', icon: FaBookOpen },
        { title: 'Tác giả', link: '/admin/authors', icon: FaUser },
        { title: 'Phân loại', link: '/admin/categories', icon: FaLayerGroup },
        { title: 'Nhà xuất bản', link: '/admin/publishers', icon: FaBuilding },
    ];

    const voucherSubmenus: Submenu[] = [
        { title: 'Discount', link: '/admin/vouchers', icon: MdLocalOffer },
        { title: 'Freeship', link: '/admin/freeships', icon: FaShoppingCart },
    ];

    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div className="bg-gradient-to-b from-indigo-800 via-blue-900 to-blue-950 min-h-screen fixed lg:w-64  transition-all duration-300 shadow-xl overflow-y-auto">
            <div className="flex flex-col items-center justify-start h-full py-6">
                {/* Admin Avatar */}
                <div className="w-10 h-10 mb-4">
                    <img 
                        src={user?.avatar_url || "https://via.placeholder.com/150"} 
                        alt="Admin" 
                        className="w-full h-full rounded-full object-cover border-3 border-white shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>

                <div className="w-4/5 h-0.5 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent my-4"></div>

                <nav className="w-full text-white font-medium">
                    <ul className="space-y-3 px-4">
                        {/* Dashboard */}
                        <li>
                            <Link 
                                to="/admin" 
                                className="flex items-center p-3 rounded-lg hover:bg-indigo-700/50 transition-all duration-300 hover:translate-x-1"
                            >
                                <FaTachometerAlt className="w-5 h-5 mr-3 text-sky-400" />
                                <span className="hidden lg:block font-semibold">Thống kê</span>
                            </Link>
                        </li>

                        {/* Product Management */}
                        <MenuGroup title="Quản lý sản phẩm" icon={FaBoxOpen} submenus={productSubmenus} />

                        {/* User Management */}
                        <li>
                            <Link 
                                to="/admin/users" 
                                className="flex items-center p-3 rounded-lg hover:bg-indigo-700/50 transition-all duration-300 hover:translate-x-1"
                            >
                                <FaUser className="w-5 h-5 mr-3 text-emerald-400" />
                                <span className="hidden lg:block font-semibold">Quản lý khách hàng</span>
                            </Link>
                        </li>

                        {/* Order Management */}
                        <li>
                            <Link 
                                to="/admin/orders" 
                                className="flex items-center p-3 rounded-lg hover:bg-indigo-700/50 transition-all duration-300 hover:translate-x-1"
                            >
                                <FaShoppingCart className="w-5 h-5 mr-3 text-amber-400" />
                                <span className="hidden lg:block font-semibold">Quản lý đơn</span>
                            </Link>
                        </li>

                        {/* Voucher Management */}
                        <MenuGroup title="Mã giảm giá" icon={FaTags} submenus={voucherSubmenus} />

                        {/* Event Management */}
                        <li>
                            <Link 
                                to="/admin/event" 
                                className="flex items-center p-3 rounded-lg hover:bg-indigo-700/50 transition-all duration-300 hover:translate-x-1"
                            >
                                <BiCalendarEvent className="w-5 h-5 mr-3 text-fuchsia-400" />
                                <span className="hidden lg:block font-semibold">Sự kiện</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default AdminLeftBar;
