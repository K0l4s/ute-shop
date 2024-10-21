import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDataReturnVNPay, getOrder } from "../../apis/order";
import { FaRegCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Order {
  order_id: number;
  total_price: string;
  shipping_fee: string;
  order_date: string;
}

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Utility to extract query parameters from the URL
  const getQueryParams = (query: string) => {
    return query
      .substring(1)
      .split("&")
      .reduce((params: any, param: string) => {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value);
        return params;
      }, {});
  };

  const queryParams = getQueryParams(location.search);
  const { vnp_Amount, vnp_TransactionStatus, vnp_TxnRef } = queryParams;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDetails = await getOrder(vnp_TxnRef);
        setOrder(orderDetails);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError("Failed to load order details.");
      }
    };
    
    const handleVNPayResponse = async () => {
      try {
        await getDataReturnVNPay(queryParams);
      } catch (error) {
        console.error('Error handling VNPay IPN:', error);
      }
    };

    if (vnp_TxnRef) {
      fetchOrderDetails();
      if (vnp_TransactionStatus) {
        handleVNPayResponse();
      }
    }
  }, [vnp_TxnRef]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        {vnp_TransactionStatus === "00" ? (
          <h1 className="flex flex-col items-center text-2xl font-semibold text-center text-green-600 mb-4">
          <FaRegCheckCircle size={64}/>
          Thanh toán thành công
        </h1>

        ) : (
          <h1 className="flex flex-col items-center text-2xl font-semibold text-center text-red-600 mb-4">
          <FaRegCheckCircle size={64}/>
          Thanh toán thất bại
        </h1>

        )}
        
        {vnp_TransactionStatus === "00" ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2 font-semibold">Cảm ơn bạn đã mua hàng tại UTE Shop!</p>
            
            {order ? (
              <div className="mt-6 text-base">
                <p className="text-gray-600">Mã đơn hàng: <span className="font-medium">{vnp_TxnRef}</span></p>
                <p className="text-gray-600">Tổng giá trị: <span className="font-medium">{(parseInt(vnp_Amount, 10) / 100).toLocaleString()} VND</span></p>
                <p className="text-gray-600">Ngày đặt hàng: {new Date(order.order_date).toLocaleString()}</p>
                <div className="flex justify-end gap-4 mt-8">
                  <button>
                    <Link to="/" className="p-2 hover:text-red-600">Về trang chủ</Link>
                  </button>
                  <button className="rounded">
                    <Link to="/account/orders" 
                      className="p-2 rounded text-white bg-green-600 hover:bg-green-700">
                      Xem đơn hàng
                    </Link>
                  </button>
                </div>
              </div>
              
            ) : error ? (
              <p className="text-red-600 mt-4">{error}</p>
            ) : (
              <p className="text-gray-600 mt-4">Loading order details...</p>
            )}

          </div>
        ) : (
          <p className="text-red-600 text-center">Payment failed or incomplete. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
