import React from 'react';
import ProductGallery from '../../components/productGallery/ProductGallery';
import ProductInfo from '../../components/productInfo/ProductInfo';
import ReviewSection from '../../components/reviewSection/ReviewSection';

const ProductDetail: React.FC = () => {
  return (
    <div className="font-sans">

      <main className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side (Image and Gallery) */}
          <div>
            <ProductGallery />
          </div>

          {/* Right side (Product Information) */}
          <div>
            <ProductInfo />
          </div>
        </div>

        {/* Review Section */}
        <ReviewSection />
      </main>

    </div>
  );
};

export default ProductDetail;
