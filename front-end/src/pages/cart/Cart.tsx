
const Cart = () => {
  return (
    <div className=" mt-10 ml-20 mr-20">
        <h1 className="text-xl font-bold">Giỏ hàng</h1>
        <div className="flex justify-between items-center mt-5 bg-gray-400">
            <div className="flex space-x-5">
                <div className="w-20 h-20 bg-gray-300"></div>
                <div>
                    <p className="text-lg font-bold">Product name</p>
                    <p>Price: $100</p>
                    <p>Quantity: 2</p>
                    
                </div>
            </div>
            <div>
                <button className="bg-red-500 text-white p-2 mr-5">Remove</button>
            </div>
        </div>
    </div>
  )
}

export default Cart