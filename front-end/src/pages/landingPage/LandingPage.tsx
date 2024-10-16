import { useEffect, useState } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { getTop10BooksAPI } from "../../apis/book";

interface Book {
  id: number;
  ISBN: string;
  title: string;
  desc: string;
  price: string;
  salePrice: string;
  year: string;
  stock: number;
  cover_img_url: string;
  publisher_id: number;
  author_id: number;
  category_id: number;
  totalSell: number;
}
const LandingPage = () => {
  const navigate = useNavigate();
  const [top10Books, setTop10Books] = useState<Book[]>([]);
  const getTop10Books = async () => {
    try {
      getTop10BooksAPI().
      then((res) => 
      {
        setTop10Books(res.data);
      }
      );

      
    } catch (err) {
      console.error("Error fetching data: ", err);
    }
  }
  useEffect(() => {
    getTop10Books();
    console.log(top10Books);
  }
    , []);
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="bg-green-400 h-64 flex justify-center items-center relative">
                <div className="absolute left-4">
                  {/* Left Arrow Icon */}
                  <button className="p-2 bg-white rounded-full shadow-md">◀</button>
                </div>
                <h1 className="text-3xl font-bold text-white">BÃO SALE MÙA HẠ GOM SÁCH BAO ĐÃ</h1>
                <div className="absolute right-4">
                  {/* Right Arrow Icon */}
                  <button className="p-2 bg-white rounded-full shadow-md">▶</button>
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-4">
              <div className="bg-yellow-200 h-32"></div>
              <div className="bg-yellow-200 h-32"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collections */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Bộ sưu tập đáng chú ý</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 shadow rounded-lg text-center">
              <div className="bg-red-200 h-32"></div>
              <p className="mt-2">Product 1</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg text-center">
              <div className="bg-red-200 h-32"></div>
              <p className="mt-2">Product 2</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg text-center">
              <div className="bg-red-200 h-32"></div>
              <p className="mt-2">Product 3</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg text-center">
              <div className="bg-red-200 h-32"></div>
              <p className="mt-2">Product 4</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Books */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Sách bán chạy</h2>
          <div className="">
            <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={5}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {top10Books.length > 0 &&
                top10Books.map((book, index) => (
                  <SwiperSlide key={index}>
                    <div key={book.id} className="min-w-40 bg-white p-4 shadow rounded-lg cursor-pointer"
                     onClick={()=>navigate("/products/"+book.id)}>
                      {/* <div className="bg-green-200 h-48 mb-4"></div> */}
                      <img src={book.cover_img_url} alt="" className="h-48 mb-4" />
                      <h3 className="font-semibold">{book.title}</h3>
                      <div className="">
                        <p className="text-xl text-red-500 font-semibold">{book.salePrice}</p>
                        <p className="text-decoration-line: line-through text-gray-500">{book.price}</p>
                      </div>
                      <p>Tổng số lượt bán: {book.totalSell || 0}/{book.stock} cuốn</p>
                    </div>
                  </SwiperSlide>
                ))

                || (<div className="bg-white p-4 shadow rounded-lg">
                  <img src="https://entail-assets.com/egnition/oos-1650365564937.jpg" alt="" className="h-48 mb-4" />
                  <h3 className="font-semibold">KHÔNG CÓ DỮ LIỆU</h3>
                  <div className="">
                    <p className="text-xl text-red-500 font-semibold">--</p>
                    <p className="text-decoration-line: line-through text-gray-500">--</p>
                  </div>
                </div>)
              }</Swiper>
          </div>
        </div>
      </section>

      {/* Partner Publishers */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Nhà xuất bản cộng tác</h2>
          <div className="flex justify-center space-x-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white p-4 shadow rounded-lg text-center">
                <div className="bg-red-200 h-16 w-16 mx-auto mb-2"></div>
                <p>NXB Kim Đồng</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Categories */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Danh mục HOT</h2>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-4 shadow rounded-lg text-center">
                <div className="bg-blue-200 h-32 w-32 mx-auto mb-2"></div>
                <p>Văn học</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage