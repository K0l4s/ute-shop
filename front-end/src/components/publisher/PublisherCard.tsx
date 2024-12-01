import React from 'react';
import logo_kimdong from '../../assets/images/logo_kimdong.png';
type PublisherCardProps = {
  id: number;
  name: string;
  address: string;
  books: { id: number; title: string }[];
};

const PublisherCard: React.FC<PublisherCardProps> = ({ name, address, books }) => {
  console.log(books);
  return (
    <div className="border p-4 rounded shadow-lg w-full bg-yellow-100">
      <img src={logo_kimdong} alt={name} className="w-full h-32 object-contain mb-2 rounded" />
      <h3 className="text-lg font-semibold">Tên NXB: {name}</h3>
      <p className="text-gray-600">Địa chỉ: {address}</p>
      <h4 className="font-semibold mt-2">Các sản phẩm:</h4>
      {books && (
        <ul className="list-disc list-inside">
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
      )}
      {books.length === 0 && <p>Không có sản phẩm nào</p>}
    </div>
  );
};

export default PublisherCard;