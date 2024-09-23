import React from 'react';

interface Menu {
  activeCategory: string;
  isVisible: boolean;
}

const Menu: React.FC<Menu> = ({ activeCategory, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bg-white shadow-lg rounded-md mt-2 p-4 w-10/12 ml-20">
      {/* Example layout, you can modify this based on your design */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 border-r pr-4">
          <ul className="space-y-4">
            <li className={`${activeCategory === 'Sách trong nước' ? 'font-bold' : ''}`}>
              Sách trong nước
            </li>
            <li className={`${activeCategory === 'Sách nước ngoài' ? 'font-bold' : ''}`}>
              Sách nước ngoài
            </li>
            <li>Văn phòng phẩm</li>
            <li>Đồ chơi - Lưu niệm</li>
            <li>Bán chạy</li>
            <li>Sản phẩm mới về</li>
          </ul>
        </div>
        {/* Content based on the active category */}
        <div className="w-3/4 pl-4">
          {activeCategory === 'Sách trong nước' && (
            <div>
              <h3 className="font-semibold mb-2">📚 Sách trong nước</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold">Văn học</h4>
                  <ul>
                    <li>Tiểu thuyết</li>
                    <li>Truyện ngắn - Tản văn</li>
                    <li>Ngôn tình</li>
                    <li>Truyện dân gian</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Kinh tế</h4>
                  <ul>
                    <li>Nhân vật</li>
                    <li>Quản trị</li>
                    <li>Marketing</li>
                    <li>Phân tích kinh tế</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Sách thiếu nhi</h4>
                  <ul>
                    <li>Manga</li>
                    <li>Kiến thức bách khoa</li>
                    <li>Sách tranh</li>
                    <li>Vừa học vừa chơi</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'Sách nước ngoài' && (
            <div>
              <h3 className="font-semibold mb-2">📚 Sách nước ngoài</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold">Văn học</h4>
                  <ul>
                    <li>Tiểu thuyết</li>
                    <li>Truyện ngắn</li>
                    <li>Ngôn tình</li>
                    <li>Truyện dân gian</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Kinh tế</h4>
                  <ul>
                    <li>Marketing</li>
                    <li>Phân tích kinh tế</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Ngoại ngữ</h4>
                  <ul>
                    <li>Tiếng Anh</li>
                    <li>Tiếng Nhật</li>
                    <li>Tiếng Hàn</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
