import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';


const ProductGallery: React.FC = () => {
    const productImages = [
        "https://bavi.edu.vn/upload/21768/fck/files/150800018_3868030666550251_8375198552020103317_n.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRciRJxV64weWAp5CGYFUoco4st5AmJsK6fWw&s",
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630482892i/11378463.jpg"];
  return (
    <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]}
    spaceBetween={50}
    slidesPerView={1}
    navigation
    pagination={{ clickable: true }}
    scrollbar={{ draggable: true }}
    onSwiper={(swiper) => console.log(swiper)}
    onSlideChange={() => console.log('slide change')}>
        {productImages.map((image, index) => (
            <SwiperSlide key={index}>
            <img src={image} alt="Product" className="w-7/12 m-auto" />
            </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default ProductGallery;
