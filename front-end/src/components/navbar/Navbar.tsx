import React from 'react'

type Props = {}

const Navbar = (props: Props) => {
  return (
    // navbar using tailwindcss
    <nav className="bg-gray-800 p-4 sticky top-0 ">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Navbar</div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-white">Home</a>
            </li>
            <li>
              <a href="#" className="text-white">About</a>
            </li>
            <li>
              <a href="#" className="text-white">Contact</a>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-white">Register</a>
            </li>
            <li>
              <a href="#" className="text-white">Login</a>
            </li>  
            <li>
              <a href="#" className="text-white">Admin</a>
            </li>
          </ul>
        </div>
      </div>
      </nav>
  )
}

export default Navbar