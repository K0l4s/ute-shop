import logo from '../../assets/images/logo.png'
import { TbLockAccess, TbLockAccessOff } from 'react-icons/tb'
import { SiAwssecretsmanager } from "react-icons/si";
import { BiSearch } from 'react-icons/bi';
import { BsMenuButtonWideFill } from 'react-icons/bs';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io';

const Navbar = () => {
  const isLogin = false;
  const isAdmin = true;
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
            <li><a href="/" className="text-white">Sách</a></li>
            <li><a href="/about" className="text-white">Nhà xuất bản</a></li>
            <li><a href="/contact" className="text-white">Về chúng tôi</a></li>
            <li><a href="/contact" className="text-white">Voucher</a></li>
          </ul>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li><a href="/cart" className="text-white"><IoMdNotificationsOutline size={30}/></a></li>
            <li><a href="/cart" className="text-white"><FiShoppingCart size={30}/></a></li>
            <li><a href="/login" className="text-white"><FaRegUserCircle size={30}/></a></li>

          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar