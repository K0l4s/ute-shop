import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

interface CartItemsProps {
  books: {
    id: number;
    title: string;
    price: number;
    salePrice?: number;
    image: string;
    quantity: number;
    stock: number;
    checked: boolean;
  }[];
  onQuantityChange: (id: number, delta: number) => void;
  onRemoveBook: (id: number) => void;
  onCheckboxChange: (id:number) => void;
  onDirectToProduct: (id: number) => void;
}

const CartItems: React.FC<CartItemsProps> = ({ books, onQuantityChange, onCheckboxChange, onRemoveBook, onDirectToProduct }) => {
  return (
    <div>
      {books.map((book) => (
        <div key={book.id} className="flex items-center justify-between py-4 border-b w-full">
          <div className='flex w-2/3 items-center'>
            <input 
              type="checkbox" 
              className="mr-4 w-5 h-5" 
              checked={book.checked}
              onChange={() => onCheckboxChange(book.id)} />
            <div className="flex" onClick={() => onDirectToProduct(book.id)}>
              <img src={book.image} alt={book.title} className="w-16 h-20" />
              <div className="flex-1 px-4">
                <p className="font-semibold line-clamp-3">{book.title}</p>
                <p className="text-base">{book.salePrice? <span className='line-through text-gray-500'>{book.price.toLocaleString()} đ</span> 
                  : <span className='text-red-500 font-semibold'>{book.price.toLocaleString()} đ</span>}</p>
                {book.salePrice && <p className="text-base font-semibold text-red-500">{book.salePrice ? book.salePrice.toLocaleString() : book.price.toLocaleString()} đ</p> }
              </div>
            </div>
          </div>
          
          <div className='flex justify-between w-1/3 items-center'>
            <div className="flex flex-col">
              <div className="flex items-center">
                <button
                  className={`${book.quantity > 1 ? 'border-black' : ''}  border px-2 rounded`}
                  onClick={() => onQuantityChange(book.id, -1)}
                  disabled={book.quantity <= 1}
                >
                  -
                </button>
                <span className="mx-2">{book.quantity}</span>
                <button
                  className={`${book.quantity < book.stock ? 'border-black ' : ''} border px-2 rounded`}
                  onClick={() => onQuantityChange(book.id, 1)}
                  disabled={book.quantity >= book.stock}
                >
                  +
                </button>
              
              </div>
              {book.quantity >= book.stock && (
                <span className="text-sm text-red-500 mt-2">Số lượng tối đa</span>
              )}
            </div>
            
            <p className="font-semibold text-lg text-red-500">
              {((book.salePrice || book.price) * book.quantity).toLocaleString()} đ
            </p>
            <button className="ml-4 text-violet-600 hover:text-violet-700" onClick={() => onRemoveBook(book.id)}>
              <FaTrashAlt size={24} />
            </button>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default CartItems;
