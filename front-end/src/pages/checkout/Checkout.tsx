import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import DiscountCode from '../../components/voucher/DiscountCode';
import { IoWarning } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { getDistance } from '../../apis/maps';
import { checkOutByVNPay, placeOrder } from '../../apis/order';
import { decodeCartData, encodeCartData } from '../../apis/cart';
import { showToast } from '../../utils/toastUtils';

const Checkout: React.FC = () => {
  interface Product {
    id: number;
    quantity: number;
    salePrice?: number;
    price: number;
    image: string;
    title: string;
    publisher: string;
  }
  const navigate = useNavigate();
  const [productsToCheckout, setProductsToCheckout] = useState<Product[]>([]);
  const [shippingFee, setShippingFee] = useState<number>(20000);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string>("");
  const [freeship] = useState<number>(0);
  const [discount] = useState<number>(0);
  const [shipping_method, setShippingMethod] = useState<string>("STANDARD");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [lastEncodedData, setLastEncodedData] = useState<string | null>(null);
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  const receiver = user?.lastname + ' ' + user?.firstname;
  // Shipping address
  const shipping_address = user?.address + ', ' + user?.ward + ', ' + user?.district + ', ' + user?.province;
  
  // Lấy các sản phẩm đã chọn từ cartSlice
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const fetchDecodedData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const dataFromUrl = queryParams.get("data");
      if (dataFromUrl && dataFromUrl !== lastEncodedData) {
        try {
          const response = await decodeCartData(dataFromUrl);
          const { decodedData } = response.data;
          setProductsToCheckout(decodedData.selectedItems || []);
          setShippingMethod(decodedData.shipping_method || "STANDARD");
          setPaymentMethod(decodedData.payment_method || "COD");
          setTotalAmount(decodedData.totalAmount || 0);
          setLastEncodedData(dataFromUrl);
        } catch (error) {
          console.error("Failed to decode cart data:", error);
        }
      }
    };
  
    fetchDecodedData();
  }, [location.search, lastEncodedData]);

  const encryptCartData = async (newPaymentMethod: string, newShippingMethod: string) => {
    const cartData = {
      selectedItems: productsToCheckout,
      shipping_method: newShippingMethod,
      payment_method: newPaymentMethod,
      totalAmount
    };

    try {
      const response = await encodeCartData(cartData);
      const encodedData = response.data.encryptedData;
      setPaymentMethod(newPaymentMethod);
      setShippingMethod(newShippingMethod);
      setLastEncodedData(encodedData);
      const newUrl = `${window.location.pathname}?data=${encodeURIComponent(encodedData)}`;
      window.history.replaceState(null, '', newUrl);
    } catch (error) {
      console.error("Failed to encode cart data:", error);
    }
  };

  // thay đổi payment method
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPaymentMethod = e.target.value;
    encryptCartData(newPaymentMethod, shipping_method);
  };

  // thay đổi shipping method
  // const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newShippingMethod = e.target.value;
  //   encryptCartData(paymentMethod, newShippingMethod);
  // };

  const calculateShippingFeeExpectedTime = (distance: number, duration: number) => {
    const baseFee = 20000; // Base fee
    let additionalFeePerKm: number;
    let baseTime: number;
    
    // distance in kilometers
    if (distance <= 20) {
      additionalFeePerKm = 200;
      baseTime = 86400; // 1 day
    } else if (distance <= 50) {
      additionalFeePerKm = 100;
      baseTime = 100800; // 1 day 4 hours
    } else if (distance <= 80) {
      additionalFeePerKm = 60;
      baseTime = 172800; // 2 days
    } else {
      additionalFeePerKm = 30;
      baseTime = 259200; // 3 days
    }

    const estimatedTimeInSeconds = duration + baseTime;
    const estimatedTimeInDays = Math.ceil(estimatedTimeInSeconds / 86400); // Convert seconds to days
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + estimatedTimeInDays);

    return {
      fee: Math.floor(baseFee + additionalFeePerKm * distance),
      estimatedDeliveryDate: convertDateToVietnamese(estimatedDeliveryDate.toDateString()),
    };
  };

  const convertDateToVietnamese = (dateString: string): string => {
    const daysOfWeek = {
      Sun: 'Chủ Nhật',
      Mon: 'Thứ 2',
      Tue: 'Thứ 3',
      Wed: 'Thứ 4',
      Thu: 'Thứ 5',
      Fri: 'Thứ 6',
      Sat: 'Thứ 7',
    };

    const monthsOfYear = [
      'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
      'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
    ];

    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.toDateString().split(' ')[0] as keyof typeof daysOfWeek];
    const day = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${day} ${month} ${year}`;
  };

  // Tính toán lại tổng tiền khi các sản phẩm thay đổi
  useEffect(() => {
    const newTotal = cartItems.reduce((acc, item) => 
      acc + (item.salePrice || item.price) * item.quantity, 0);
    setTotalAmount(newTotal);
  }, [cartItems]);
  
  const handlePlaceOrder = async () => {
    const orderItems = productsToCheckout.map(item => ({
      book_id: item.id,
      quantity: item.quantity,
      unit_price: item.salePrice || item.price,
    }));
    
    const orderData = {
      total_price: totalAmount + shippingFee - freeship - discount,
      shipping_address,
      shipping_method: "STANDARD",
      shipping_fee: shippingFee,
      payment_method: paymentMethod,
      orderItems
    };

    try {
      if (paymentMethod === "COD") {
        await placeOrder(orderData);
        showToast("Đơn hàng đã được đặt thành công!", "success");
        navigate("/account/orders");
        window.scrollTo(0, 0);
      }
      else if (paymentMethod === "VNPAY") {
        const res = await checkOutByVNPay(orderData);
        if (res.paymentUrl) {
          window.location.href = res.paymentUrl;
        }
      }
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  useEffect(() => {
    const fetchShippingFee = async () => {
      if (user?.address && user?.ward && user?.district && user?.province) {
        const destination = `${user.address}, ${user.ward}, ${user.district}, ${user.province}`;
        try {
          const data = await getDistance(destination);
          const {fee, estimatedDeliveryDate} = calculateShippingFeeExpectedTime(data.distanceInKilometers, data.duration);
          setShippingFee(fee);
          setEstimatedDeliveryDate(estimatedDeliveryDate);
        } catch (error) {
          console.error('Error calculating shipping fee:', error);
        }
      }
    };

    fetchShippingFee();
  }, [user]);

  return (
    <div className="container mx-auto px-16 py-8">
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
        <p className="font-semibold">Người nhận: {receiver}</p>
      </div>

      {/* Phương Thức Vận Chuyển */}
      <div className="border-2 border-black p-4 rounded mb-6">
        <h3 className="text-lg text-violet-700 font-bold mb-2 border-b border-black pb-2">PHƯƠNG THỨC VẬN CHUYỂN</h3>
        <input type="radio" name="fee" id="fee" defaultChecked/>
        <label htmlFor="fee" className="ml-2 font-semibold">
          Giao hàng tiêu chuẩn: <span>{shippingFee.toLocaleString()} đ</span>
        </label>
          
        <p >Dự kiến nhận hàng: 
          <span className='font-semibold ml-2'>{estimatedDeliveryDate}</span>
        </p>
      </div>

      {/* Phương Thức Thanh Toán */}
      <div className="border-2 border-black p-4 rounded mb-6">
        <h2 className="text-lg text-violet-700 font-bold mb-2 border-b border-black pb-2">PHƯƠNG THỨC THANH TOÁN</h2>
        <input 
          type="radio" 
          name="payment" 
          id="cod" 
          value="COD"
          checked={paymentMethod === "COD"}
          onChange={handlePaymentChange} />
        <label htmlFor="cod" className="ml-2 font-semibold">Thanh toán khi nhận hàng</label>
        <br />
        <input 
          type="radio" 
          name="payment" 
          id="vnPay"
          value="VNPAY"
          checked={paymentMethod === "VNPAY"}
          onChange={handlePaymentChange} />
        <label htmlFor="vnPay" className="ml-2 font-semibold">VNPAY</label>
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
                  <img src={product.image} alt={product.title} className="w-16 h-20 rounded" />
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
            <span>{totalAmount.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>{shippingFee.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between">
            <span>Voucher freeship:</span>
            <span>{freeship} đ</span>
          </div>
          <div className="flex justify-between">
            <span>Voucher giảm giá:</span>
            <span>{discount} đ</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Thành tiền:</span>
            <span>{(totalAmount + shippingFee - freeship - discount).toLocaleString()} đ</span>
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
        <button className="bg-red-500 text-white font-bold py-3 px-6 rounded shadow hover:bg-red-600"
          onClick={handlePlaceOrder}>
          XÁC NHẬN THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default Checkout;