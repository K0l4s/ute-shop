import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { calculateTotal } from '../../redux/reducers/cartSlice';
import DiscountCode from '../../components/voucher/DiscountCode';
import { IoWarning } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Checkout: React.FC = () => {
  const dispatch = useDispatch();

  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  // Shipping address
  const shipping_address = user?.address + ', ' + user?.ward + ', ' + user?.district + ', ' + user?.province;
  
  // Lấy các sản phẩm đã chọn từ cartSlice
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.total);

  // Lọc các sản phẩm đã được checked
  const productsToCheckout = cartItems.filter((item) => item.checked);

  // Tính toán lại tổng tiền khi các sản phẩm thay đổi
  useEffect(() => {
    dispatch(calculateTotal());
  }, [cartItems, dispatch]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl text-violet-700 font-bold mb-4">XÁC NHẬN THANH TOÁN</h1>
      
      {/* Địa Chỉ Giao Hàng */}
      <div className="border-2 border-black p-4 rounded mb-6">
        <h3 className="text-lg text-violet-700 font-bold mb-2 border-b border-black pb-2">ĐỊA CHỈ NHẬN HÀNG</h3>
        <div className='flex justify-between'>
          <p className='font-semibold flex'>Địa chỉ cụ thể: { shipping_address ||
            <span className='flex justify-center items-center ml-2'>
              Vui lòng thay đổi địa chỉ 
              <IoWarning size={24} color='red'/> 
            </span>}
          </p>
          <Link to="/account/address">
            <button className='font-semibold text-violet-700 hover:text-violet-600'>Thay đổi</button>
          </Link>
        </div>
      </div>

      {/* Phương Thức Vận Chuyển */}
      <div className="border-2 border-black p-4 rounded mb-6">
        <h3 className="text-lg text-violet-700 font-bold mb-2 border-b border-black pb-2">PHƯƠNG THỨC VẬN CHUYỂN</h3>
        <input type="radio" name="fee" id="fee" />
        <label htmlFor="fee" className="ml-2 font-semibold">
          Giao hàng tiêu chuẩn: 20.000 đ
        </label>
          
        <p >Dự kiến nhận hàng: Thứ 7 - 30/10/2024</p>
      </div>

      {/* Phương Thức Thanh Toán */}
      <div className="border-2 border-black p-4 rounded mb-6">
        <h2 className="text-lg text-violet-700 font-bold mb-2 border-b border-black pb-2">PHƯƠNG THỨC THANH TOÁN</h2>
        <input type="radio" name="payment" id="vnPay" />
        <label htmlFor="vnPay" className="ml-2 font-semibold">VNPAY</label>
        <br />
        <input type="radio" name="payment" id="cod" />
        <label htmlFor="cod" className="ml-2 font-semibold">Thanh toán khi nhận hàng</label>
      </div>

      {/* Khuyến Mãi */}
      <div className='border-2 border-black rounded overflow-hidden'>
        <DiscountCode />
      </div>

      {/* Kiểm Tra Đơn Hàng */}
      <div className="border-2 border-black p-4 rounded mt-6 mb-6">
        <h2 className="text-lg text-violet-700 font-bold mb-2 border-b border-black pb-2">KIỂM TRA ĐƠN HÀNG</h2>
        <div className="space-y-4">
          {productsToCheckout.length > 0 ? (
            productsToCheckout.map((product) => (
              <div key={product.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <div className="flex items-center space-x-4">
                  <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-600">Phân loại: {product.publisher}</p>
                    <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                  </div>
                </div>
                <div className="text-red-500 font-bold">
                  {(product.salePrice || product.price).toLocaleString()} đ
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Không có sản phẩm nào được chọn để thanh toán.</p>
          )}
        </div>
      </div>

      {/* Tổng kết đơn hàng */}
      <div className="border-2 border-black p-4 rounded mb-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tổng tiền:</span>
            <span>{total.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>20.000 đ</span>
          </div>
          <div className="flex justify-between">
            <span>Voucher freeship:</span>
            <span>-20.000 đ</span>
          </div>
          <div className="flex justify-between">
            <span>Voucher giảm giá:</span>
            <span>-60.000 đ</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Thành tiền:</span>
            <span>{(total - 60_000).toLocaleString()} đ</span>
          </div>
        </div>
      </div>

      {/* Nút xác nhận thanh toán */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input type="checkbox" id="agree" />
          <label htmlFor="agree" className="ml-2 text-sm">
            Bằng việc tiến hành mua hàng, bạn đã đồng ý với{' '}
            <a href="/" className="text-blue-600 underline">Điều khoản và điều kiện của UTE Shop</a>
          </label>
        </div>
        <button className="bg-red-500 text-white font-bold py-3 px-6 rounded shadow hover:bg-red-600">
          XÁC NHẬN THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default Checkout;
