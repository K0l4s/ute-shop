import logo from '../../assets/images/logo.png'
import {TbLockAccess, TbLockAccessOff } from 'react-icons/tb'
import { SiAwssecretsmanager } from "react-icons/si";

const Navbar = () => {
  const isLogin = false;
  const isAdmin = true;
  return (
    // navbar using tailwindcss
    <nav className="bg-gray-800 p-4 sticky top-0 ">
      <div className="container mx-auto flex justify-between items-center">
        <img className='h-10' src={logo} alt="" />
        <div>
          {/* searchBox */}
          <div className="flex items-center w-100">
            <input type="text" placeholder="Search" className="p-2 rounded-l-lg w-80"  />
            <button className="bg-gray-900 text-white p-2 rounded-r-lg">Search</button>
          </div>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li>
              {isLogin ? <a href="../logout" className="text-white"><TbLockAccessOff/></a> : <a href="../login" className="text-white"><TbLockAccess/></a>}
            </li>  
            <li>
              {isAdmin ? <a href="../admin" className="text-white"><SiAwssecretsmanager/></a> : null}
            </li>
          </ul>
        </div>
      </div>
      </nav>
  )
}

export default Navbar