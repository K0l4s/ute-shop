import React from 'react';
import { FaTachometerAlt, FaUser, FaBoxOpen, FaShoppingCart, FaTags, FaBookOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MenuGroup from './MenuGroup';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// Define the type for a submenu item
interface Submenu {
    title: string;
    link: string;
    icon: any;
}

const AdminLeftBar: React.FC = () => {
    // Define the structure of the submenus
    const productSubmenus: Submenu[] = [
        { title: 'Sách', link: '/admin/products', icon: FaBookOpen },
        { title: 'Tác giả', link: '/admin/authors', icon: FaBoxOpen },
        { title: 'Phân loại', link: '/admin/categories', icon: FaBoxOpen },
        { title: 'Nhà xuất bản', link: '/admin/brands', icon: FaBoxOpen },
    ];

    const userSubmenus: Submenu[] = [
        { title: 'Khách hàng', link: '/admin/customers', icon: FaUser },
        { title: 'Admin', link: '/admin/admins', icon: FaUser },
    ];
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <div className="bg-gradient-to-b from-violet-900 to-blue-900 min-h-screen fixed lg:w-64 w-16 md:w-48 transition-all duration-300">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mt-4">
                    <img src={user?.avatar_url || "https://via.placeholder.com/150"} alt="Admin" className="w-full h-full rounded-full object-fit object-cover" />
                </div>

                <div className="w-4/5 h-0.5 bg-gray-700 my-4 rounded-xl"></div>
                <ul className="text-white font-bold text-center">
                    {/* Dashboard link */}
                    <Link to={"/admin"} className="flex items-center hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2">
                        <FaTachometerAlt className="mr-2" />
                        <span className="hidden lg:block">Thống kê</span>
                    </Link>

                    {/* Menu Groups */}
                    <MenuGroup title="Quản lý sản phẩm" icon={FaBoxOpen} submenus={productSubmenus} />
                    <MenuGroup title="User" icon={FaUser} submenus={userSubmenus} />

                    <Link to={"/admin/orders"} className="flex items-center hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2">
                        <FaShoppingCart className="mr-2" />
                        <span className="hidden lg:block">Quản lý đơn</span>
                    </Link>

                    <Link to={"/admin/vouchers"} className="flex items-center hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2">
                        <FaTags className="mr-2" />
                        <span className="hidden lg:block">Mã giảm giá</span>
                    </Link>
                </ul>
            </div>
        </div>
    );
};

export default AdminLeftBar;
