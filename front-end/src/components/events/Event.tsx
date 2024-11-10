import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Event:React.FC = () => {
  const [eventImages, setEventImages] = useState<string[]>([]);

  useEffect(() => {
    // Mock API call to fetch event images
    const fetchEventImages = async () => {
      const images = [
        "/megasale.jpeg",
        "/christmas_sale.jpg",
        "/regular_sale.jpg"
      ];
      setEventImages(images);
    };

    fetchEventImages();
  }, []);

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {eventImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Event ${index + 1}`} className="w-full h-112 object-fit rounded-md" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
};

export default Event;