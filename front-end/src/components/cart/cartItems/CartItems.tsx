
import  { useState } from 'react';

type products = {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const CartItems = (item: products) => {
  const [quantity, setQuantity] = useState<number>(item.quantity);

  const changeQuantity = (type: "add" | "subtract") =>{
    if (type === "add") {
      setQuantity(prevQuantity => prevQuantity + 1);
    } else if (type === "subtract") {
      setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    }
  }
  return (
    <div className="flex justify-between items-center mt-5 bg-gray-400 rounded-2xl">
      <div className="flex space-x-5">
        <div className="w-20 h-20 bg-gray-300"></div>
        <div>
          <p className="text-lg font-bold">{item.name}</p>
          <p>Price: ${item.price}</p>
          <p>
            <button className="bg-blue-500 text-white p-2" onClick={()=>changeQuantity("subtract")}>-</button>
            {quantity}
            <button className="bg-blue-500 text-white p-2" onClick={()=>changeQuantity("add")}>+</button>
          </p>
        </div>
      </div>
      <div>
        <button className="bg-green-500 text-white p-2 mr-5">Product Detail</button>
        <button className="bg-red-500 text-white p-2 mr-5">Remove</button>
      </div>
    </div>
  );
}

export default CartItems;
