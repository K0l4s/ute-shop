let express = require('express');
let router = express.Router();
const request = require('request');
const moment = require('moment');
const db = require('../models');
const { createOrder } = require('../services/orderService');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const Order = db.Order;
const Payment = db.Payment;
const Detail_Order = db.Detail_Order;
const sequelize = db.sequelize;
const Book = db.Book;
const Notification = db.Notification;
const OrderTracking = db.OrderTracking;
const Discount = db.Discount;
const FreeShip = db.Freeship;
const Cart = db.Cart;
const Wallet = db.Wallet;
const querystring = require('qs');
const crypto = require('crypto');
const { sendNotificationToClient, sendOrderNotificationToAdmins } = require('../services/notificationService');
// 
router.post('/create_payment_url', authenticateJWT, async function (req, res, next) {
  const userId = req.user.id; // Lấy userId từ req.user sau khi authenticateJWT
  const orderData = req.body;
  const t = await sequelize.transaction();
  const wss = req.wss;
  try {
    // Tạo đơn hàng trước khi gọi đến VNPAY
    const { newOrder, newPayment } = await createOrder(userId, orderData, t, wss);

    let vnpUrl = await generateVnpUrl(newOrder, req, res);
    await t.commit();

    res.status(200).json({ paymentUrl: vnpUrl });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
});

router.get('/vnpay_return', authenticateJWT, async function (req, res, next) {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  let vnp_OrderInfo = decodeURIComponent(vnp_Params['vnp_OrderInfo']);
  vnp_OrderInfo = vnp_OrderInfo.replace(/\+/g, ' '); // Thay thế dấu "+" bằng dấu cách
  vnp_Params['vnp_OrderInfo'] = vnp_OrderInfo;

  vnp_Params = sortObject(vnp_Params);

  let tmnCode = process.env.vnp_TmnCode
  let secretKey = process.env.vnp_HashSecret

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");     

  if (secureHash === signed) {
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    if (rspCode === '00') {
      // Thanh toán thành công, cập nhật trạng thái đơn hàng và thanh toán
      res.status(200).json({ message: 'Payment successful' });
    } else {
      // Thanh toán thất bại
      res.status(400).json({ message: 'Payment failed' });
    }
  } else {
    res.status(400).json({ message: 'Checksum failed' });
  }
});

router.get('/vnpay_ipn', async function (req, res, next) {
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];
  let orderId = vnp_Params['vnp_TxnRef'];

  let order;
  try {
    order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  
  let userId = order.user_id;

  let rspCode = vnp_Params['vnp_ResponseCode'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  let vnp_OrderInfo = decodeURIComponent(vnp_Params['vnp_OrderInfo']);
  vnp_OrderInfo = vnp_OrderInfo.replace(/\+/g, ' '); // Thay thế dấu "+" bằng dấu cách
  vnp_Params['vnp_OrderInfo'] = vnp_OrderInfo;

  vnp_Params = sortObject(vnp_Params);
  let secretKey = process.env.vnp_HashSecret;

  let signData = querystring.stringify(vnp_Params, { encode: false });

  let hmac = crypto.createHmac("sha512", secretKey);

  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
  let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
  
  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if(secureHash === signed){ //kiểm tra checksum
    const t = await sequelize.transaction();
      if(checkOrderId){
        if(checkAmount){
          if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
              if(rspCode=="00"){
                //thanh cong
                //paymentStatus = '1'
                // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                // Thanh toán thành công, cập nhật trạng thái đơn hàng và thanh toán
                // await Order.update({ status: 'PROCESSING' }, { where: { id: orderId }, transaction: t});
                await Payment.update({ status: 'COMPLETED', payment_date: new Date() }, { where: { order_id: orderId }, transaction: t});
                // await OrderTracking.update({ confirmedAt: new Date() }, { where: { order_id: orderId }, transaction: t });
                
                const orderItems = await Detail_Order.findAll({ where: { order_id: orderId }, transaction: t });
                // Xóa các mục tương ứng trong giỏ hàng
                for (const item of orderItems) {
                  await Cart.destroy({
                    where: {
                      user_id: userId,
                      book_id: item.book_id
                    },
                    transaction: t
                  });
                }

                // Tạo thông báo mới trong database
                const newNotification = await Notification.create({
                  user_id: userId,
                  order_id: orderId,
                  message: `Đơn hàng #${orderId} của bạn đã được thanh toán thành công và đang chờ xử lý.`,
                  type: 'ORDER_UPDATE',
                  createdAt: new Date(),
                  is_read: false
                }, { transaction: t });
                
                await t.commit();
                // Gửi thông báo qua WebSocket
                sendNotificationToClient(req.wss, newNotification);

                // Send to admin
                const messageToAdmin = `Có đơn hàng mới #${orderId} cần xử lý từ khách hàng #${userId}`;
                await sendOrderNotificationToAdmins(req.wss, orderId, messageToAdmin);

                res.status(200).json({RspCode: '00', Message: 'Success'})
              }
              else {
                //that bai
                //paymentStatus = '2'
                // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                console.log("Payment failed");
                const orderItems = await Detail_Order.findAll({ where: { order_id: orderId }, transaction: t });
                 // Tăng lại stock
                for (const item of orderItems) {
                  await Book.increment('stock', { by: item.quantity, where: { id: item.book_id }, transaction: t });
                  await Book.decrement('sold', { by: item.quantity, where: { id: item.book_id }, transaction: t });
                }
                await Discount.increment('stock', { by: 1, where: { id: order.discount_id }, transaction: t });
                await FreeShip.increment('stock', { by: 1, where: { id: order.freeship_id }, transaction: t });
                await OrderTracking.destroy({ where: { order_id: orderId }});
                await Order.destroy({ where: { id: orderId }, transaction: t });
                await Payment.destroy({ where: { order_id: orderId }, transaction: t });
                await Notification.destroy({ where: { order_id: orderId }});
                
                // Hoàn trả coins lại cho wallet của user
                if (order.coins_used > 0) {
                  const wallet = await Wallet.findOne({ where: { userId: userId }, transaction: t });
                  if (wallet) {
                    wallet.coins += order.coins_used;
                    await wallet.save({ transaction: t });
                  }
                }

                await t.commit();
                res.status(200).json({ RspCode: '24', Message: 'Payment cancelled or failed, rolled back order and payment' });
                // res.status(200).json({RspCode: '00', Message: 'Success'})
              }
          }
          else{
            res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
          }
        }
        else{
          await t.rollback();
          res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
        }
      }       
      else {
        res.status(200).json({RspCode: '01', Message: 'Order not found'})
      }
  }
  else {
    await t.rollback();
    res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
  }
});

router.post('/querydr', function (req, res, next) {
  
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();

  let vnp_TmnCode = process.env.vnp_TmnCode;
  let secretKey = process.env.vnp_HashSecret;
  let vnp_Api = process.env.vnp_Api;
  
  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;
  
  let vnp_RequestId =moment(date).format('HHmmss');
  let vnp_Version = '2.1.0';
  let vnp_Command = 'querydr';
  let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;
  
  let vnp_IpAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

  let currCode = 'VND';
  let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
  
  let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
  
  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex"); 
  
  let dataObj = {
      'vnp_RequestId': vnp_RequestId,
      'vnp_Version': vnp_Version,
      'vnp_Command': vnp_Command,
      'vnp_TmnCode': vnp_TmnCode,
      'vnp_TxnRef': vnp_TxnRef,
      'vnp_OrderInfo': vnp_OrderInfo,
      'vnp_TransactionDate': vnp_TransactionDate,
      'vnp_CreateDate': vnp_CreateDate,
      'vnp_IpAddr': vnp_IpAddr,
      'vnp_SecureHash': vnp_SecureHash
  };
  // /merchant_webapi/api/transaction
  request({
      url: vnp_Api,
      method: "POST",
      json: true,   
      body: dataObj
          }, function (error, response, body){
              console.log(response);
          });

});

router.post('/refund', function (req, res, next) {
  
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();

  let vnp_TmnCode = process.env.vnp_TmnCode;
  let secretKey = process.env.vnp_HashSecret;
  let vnp_Api = process.env.vnp_Api;
  
  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;
  let vnp_Amount = req.body.amount *100;
  let vnp_TransactionType = req.body.transType;
  let vnp_CreateBy = req.body.user;
          
  let currCode = 'VND';
  
  let vnp_RequestId = moment(date).format('HHmmss');
  let vnp_Version = '2.1.0';
  let vnp_Command = 'refund';
  let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;
          
  let vnp_IpAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

  
  let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
  
  let vnp_TransactionNo = '0';
  
  let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");
  
   let dataObj = {
      'vnp_RequestId': vnp_RequestId,
      'vnp_Version': vnp_Version,
      'vnp_Command': vnp_Command,
      'vnp_TmnCode': vnp_TmnCode,
      'vnp_TransactionType': vnp_TransactionType,
      'vnp_TxnRef': vnp_TxnRef,
      'vnp_Amount': vnp_Amount,
      'vnp_TransactionNo': vnp_TransactionNo,
      'vnp_CreateBy': vnp_CreateBy,
      'vnp_OrderInfo': vnp_OrderInfo,
      'vnp_TransactionDate': vnp_TransactionDate,
      'vnp_CreateDate': vnp_CreateDate,
      'vnp_IpAddr': vnp_IpAddr,
      'vnp_SecureHash': vnp_SecureHash
  };
  
  request({
      url: vnp_Api,
      method: "POST",
      json: true,   
      body: dataObj
          }, function (error, response, body){
              console.log(response);
          });
  
});

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const generateVnpUrl = async (order, req, res) => {
  try {
    const vnp_TmnCode = process.env.vnp_TmnCode;
    const secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    const returnUrl = process.env.vnp_ReturnUrl;
    
    // Lấy thông tin cần thiết từ đơn hàng
    const orderId = order.id; // Mã đơn hàng
    const amount = order.total_price * 100; // Tổng tiền thanh toán (VNPay yêu cầu nhân 100)

    // Lấy IP người dùng
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    // Tạo các tham số gửi lên VNPay
    let vnp_Params = {
      'vnp_Version': '2.1.0',
      'vnp_Command': 'pay',
      'vnp_TmnCode': vnp_TmnCode,
      'vnp_Locale': 'vn',
      'vnp_CurrCode': 'VND',
      'vnp_TxnRef': orderId, // Mã tham chiếu đơn hàng
      'vnp_OrderInfo': `Thanh toán đơn hàng #${orderId}`,
      'vnp_OrderType': 'other',
      'vnp_Amount': amount, // Tổng tiền thanh toán
      'vnp_ReturnUrl': returnUrl,
      'vnp_IpAddr': ipAddr,
      'vnp_CreateDate': createDate
    };

    // Sắp xếp các tham số theo thứ tự alphabet
    vnp_Params = sortObject(vnp_Params);

    // Tạo chữ ký bảo mật (SecureHash)
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;

  } catch (error) {
    throw new Error("Error generating VNPay URL: " + error.message);
  }
};

module.exports = router;