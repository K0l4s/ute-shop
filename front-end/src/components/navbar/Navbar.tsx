import React from 'react'
import logo from '../../access/image/logo.png'
type Props = {}

const Navbar = (props: Props) => {
  return (
    <>
    <nav className='bg-blue-400 '>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center'>
          <div className='w-16'>
            <a href='/'><img src={logo} alt="logo" /></a>
          </div>
          <div>
            <a href='/login' className='text-white'>Login</a>
            <a href='/register' className='text-white ml-4'>Register</a>
            <a href='/admin' className='text-white ml-4'>Admin</a>
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}

export default Navbar