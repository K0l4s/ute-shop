import React from 'react';

const ReviewSection: React.FC = () => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>
      <div className="mt-4 flex items-center space-x-4">
        <span className="text-4xl font-bold">4/5</span>
        <span className="text-yellow-500">★★★★☆</span>
        <span>(25 reviews)</span>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="font-bold">Huỳnh Trung Kiên</p>
          <p className="text-yellow-500">★★★★☆</p>
          <p>Truyện này rất hay, tôi rất thích!</p>
        </div>
        {/* Add more reviews similarly */}
      </div>
    </div>
  );
};

export default ReviewSection;
