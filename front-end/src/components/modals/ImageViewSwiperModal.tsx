// src/components/modals/ImageViewSwiperModal.tsx
import React from 'react';
import Modal from 'react-modal';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { IoMdClose } from 'react-icons/io';
import './ImageViewSwiperModal.css';

interface ImageViewSwiperModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  images: string[];
  initialSlide: number;
}

const ImageViewSwiperModal: React.FC<ImageViewSwiperModalProps> = ({ isOpen, onRequestClose, images, initialSlide }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Image Modal"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-90 z-40"
    >
      <button onClick={onRequestClose} className="absolute top-2 right-2 text-white z-50">
        <IoMdClose size={40}/>
      </button>
      <Swiper
        initialSlide={initialSlide}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        style={{ height: '100%' }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className='flex justify-center items-center' style={{height: "100%"}}>
            <img src={image} alt="Product" className="max-h-full" />
          </SwiperSlide>
        ))}
      </Swiper>
    </Modal>
  );
};

export default ImageViewSwiperModal;