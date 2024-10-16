const AdminLeftBar = () => {
    return (
        <div className="w-56 bg-gray-900 min-h-screen fixed">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mt-4">
                    <img src="https://via.placeholder.com/150" alt="Admin" className="w-full h-full rounded-full" />
                </div>
                <div className="text-white text-center">
                    <h3 className="font-semibold">Role: Admin</h3>
                </div> 

                <div className="w-4/5 h-0.5 bg-gray-700 my-4 rounded-xl"></div>
                <ul  className="text-white font-bold text-center">
                    <li className="hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2">Dashboard</li>
                    <li className="hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2">User</li>
                    <li className="hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2">Product</li>
                    <li className="hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2">Order</li>
                    <li className="hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2">Voucher</li>
                </ul>
            </div>
        </div>
    )
}

export default AdminLeftBar