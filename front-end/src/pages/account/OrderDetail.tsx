// OrderDetail.tsx
import { useEffect, useState } from 'react'
import { Order } from '../../models/OrderType'
import Modal from 'react-modal'
import { getDetailOrderByUser } from '../../apis/order'
import { IoClose } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { formatStatus } from '../../utils/orderUtils'
import { FaFileCircleCheck } from 'react-icons/fa6'
import { FaTruck, FaTruckLoading } from 'react-icons/fa'
import { LuPackageCheck } from 'react-icons/lu'
import { formatDateTime } from '../../utils/dateUtils'
import { formatPriceToVND } from '../../utils/bookUtils'
import { useNavigate } from 'react-router-dom'

Modal.setAppElement('#root')

const OrderDetail = ({ orderId, isOpen, onClose }: { orderId: number; onClose: () => void; isOpen: boolean }) => {
  const user = useSelector((state: RootState) => state.auth.user)

  const [order, setOrder] = useState<Order | null>(null)
  const [orderDetails, setOrderDetails] = useState<any[]>([])

  const receiver = user?.lastname + ' ' + user?.firstname
  const phone = user?.phone
  const shippingAddress = user?.address + ' ' + user?.ward + ', ' + user?.district + ', ' + user?.province
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await getDetailOrderByUser(orderId)
        setOrder(response.data.order)
        setOrderDetails(response.data.orderDetails)
      } catch (error) {
        console.error('Error fetching order details:', error)
      }
    }

    if (isOpen) {
      fetchOrderDetail()
    }
  }, [orderId, isOpen])

  if (!order) {
    return null
  }

  const sumPrice = (orderDetails: any[]) => {
    return orderDetails.reduce((acc, detail) => acc + Number(detail.price) * detail.quantity, 0);
  };

  const calculateDiscountPercent = (discountPerc: any, orderDetails: any) => {
    const amount = sumPrice(orderDetails);
    return formatPriceToVND(amount * parseInt(discountPerc) / 100);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName='fixed inset-0 bg-gray-600 bg-opacity-75'
      className='z-80 absolute top-1/2 mt-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-[70vh] xl:w-[100vh] w-[40vh] h-[90vh]
        overflow-auto bg-white rounded shadow-lg'
    >
      <div className='bg-white rounded-lg p-6'>
        <button onClick={onClose} className='text-blue-500 my-4 bg-gray-300 p-2 rounded-full absolute top-0 right-4'>
          <IoClose size={24} />
        </button>

        <div className='flex text-lg font-semibold'>
          <h2 className='mb-2'>MÃ ĐƠN HÀNG: #{order.id} |</h2>
          <p className='text-red-500 ml-2'>{formatStatus(order.status).toUpperCase()}</p>
        </div>

        {/* Order Tracking */}
        <div className='flex items-center space-x-4 my-4 border border-gray-400 p-4'>
          <div className='flex flex-col items-center'>
            <div
              className={`p-3 rounded-full text-white ${(order.status !== 'PENDING' && order.orderTracking.confirmedAt) ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <FaFileCircleCheck size={24} />
            </div>
            <p className='font-semibold text-base'>Đã xác nhận</p>
            <span className='text-sm text-gray-600'>{formatDateTime(order.orderTracking.confirmedAt)}</span>
          </div>
          <div className='flex-grow border-t border-gray-600'></div>
          <div className='flex flex-col items-center'>
            <div
              className={`p-3 rounded-full ${order.status === 'PENDING' || order.status === 'CONFIRMED' || !order.orderTracking.processedAt ? 'bg-gray-300' : 'bg-green-500'} text-white`}
            >
              <FaTruckLoading size={24} />
            </div>
            <p className='font-semibold text-base'>Đang xử lý</p>
            <span className='text-sm text-gray-600'>{formatDateTime(order.orderTracking.processedAt)}</span>
          </div>
          <div className='flex-grow border-t border-gray-600'></div>
          <div className='flex flex-col items-center'>
            <div
              className={`p-3 rounded-full ${order.status === 'DELIVERED' || order.status === 'SHIPPED' || order.status === 'RETURNED' ? 'bg-green-500' : 'bg-gray-300'} text-white`}
            >
              <FaTruck size={24} />
            </div>
            <p className='font-semibold text-base'>Đơn hàng đang giao</p>
            <span className='text-sm text-gray-600'>{formatDateTime(order.orderTracking.deliveredAt)}</span>
          </div>
          <div className='flex-grow border-t border-gray-600'></div>
          <div className='flex flex-col items-center'>
            <div
              className={`p-3 rounded-full ${order.status === 'SHIPPED' || order.status === 'RETURNED' ? 'bg-green-500' : 'bg-gray-300'} text-white`}
            >
              <LuPackageCheck size={24} />
            </div>
            <p className='font-semibold text-base'>Đã nhận hàng</p>
            <span className='text-sm text-gray-600'>
              {order.status === 'SHIPPED' || order.status === 'RETURNED' ? formatDateTime(order.orderTracking.shippedAt) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className='border border-gray-400 p-4 bg-white text-base'>
          <h3 className='text-lg font-semibold'>Địa chỉ nhận hàng</h3>
          <div className='flex flex-col ml-4'>
            <p className='font-semibold'>{receiver}</p>
            <p>{phone}</p>
            <p>{shippingAddress}</p>
          </div>
        </div>

        {/* Payment */}
        <div className='border border-gray-400 p-4 bg-white mt-4'>
          <h3 className='text-lg font-semibold'>Phương thức thanh toán</h3>
          <div className='flex flex-col ml-4'>
            <p className='text-violet-600'>{order.payment.payment_method === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán VNPay'}</p>
            {order.payment.payment_date && 
              <p className='text-green-600'>Ngày thanh toán: {formatDateTime(order.payment.payment_date)}</p>
            }
            <p className={`${order.payment.status === 'COMPLETED' ? 'text-green-600' : 'text-red-500'}`}>{order.payment.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chưa thanh toán' }</p>
          </div>
        </div>

        {/* Order Details */}
        <div className='bg-white border border-gray-400 mt-4 p-4'>
          <h3 className='text-lg font-semibold mb-2'>Chi tiết đơn hàng</h3>
          <ul>
            {orderDetails.map((detail) => (
              <li key={detail.id} className='p-2 cursor-pointer' onClick={() => {navigate(`/products/${detail.book.id}`)}}>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <img
                      src={detail.book.cover_img_url}
                      alt={detail.book.title}
                      className='w-16 h-20 mr-4 object-cover'
                    />
                    <div>
                      <p className='font-semibold'>{detail.book.title}</p>
                      <p className='text-gray-700'>Phân loại: {detail.book.category.name}</p>
                      <p className='text-gray-700'>Số lượng: {detail.quantity}</p>
                      <p className='text-gray-700'>
                        Đơn giá:
                        <span className='font-semibold'> {formatPriceToVND(detail.price)} đ</span>
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-gray-700'>
                      <span className='font-semibold'>
                        {' '}
                        {formatPriceToVND((Number(detail.price) * detail.quantity).toString())} đ
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-4 rounded-b-lg'>
          <table className='min-w-full bg-white'>
            <tbody>
              <tr>
                <td className='border border-gray-400 px-4 py-2 font-semibold text-right'>Tổng tiền</td>
                <td className='border border-gray-400 px-4 py-2 text-right'>{formatPriceToVND((sumPrice(orderDetails).toString()))} đ</td>
              </tr>
              <tr>
                <td className='border border-gray-400 px-4 py-2 font-semibold text-right'>Phí vận chuyển</td>
                <td className='border border-gray-400 px-4 py-2 text-right'>
                  {formatPriceToVND(order.shipping_fee.toString())} đ
                </td>
              </tr>
              <tr>
                <td className='border border-gray-400 px-4 py-2 font-semibold text-right'>Miễn vận chuyển</td>
                <td className='border border-gray-400 px-4 py-2 text-right'>- {order.freeship ? `${(order.freeship.discount_val) || calculateDiscountPercent(order.discount.discount_perc, orderDetails)}` : '0'} đ</td>
              </tr>
              <tr>
                <td className='border border-gray-400 px-4 py-2 font-semibold text-right'>Giảm giá</td>
                <td className='border border-gray-400 px-4 py-2 text-right'>- {order.discount ? `${(order.discount.discount_val) || calculateDiscountPercent(order.discount.discount_perc, orderDetails)}` : '0'} đ</td>
              </tr>
              <tr>
                <td className='border border-gray-400 px-4 py-2 font-semibold text-right'>Thành tiền</td>
                <td className='border border-gray-400 px-4 py-2 text-red-600 font-bold text-xl text-right'>
                  {formatPriceToVND(order.total_price).toString()} đ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  )
}

export default OrderDetail
