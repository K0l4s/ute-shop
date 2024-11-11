const nodemailer = require('nodemailer');

const logo_url = "https://res.cloudinary.com/ddfq7ifig/image/upload/v1731327709/logo_al7chu.png";
// Tạo một transporter để gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Hàm gửi email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error('Error sending email');
  }
};

// Hàm tạo mã xác thực ngẫu nhiên gồm 6 chữ số
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendOrderDetailsEmail = async (to, order, orderDetail) => {
  const bookDetails = orderDetail.map(item => `
    <!-- Product Details -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">
      <tr>
        <td width="100" style="padding-right: 10px;">
          <img src="${item.book.cover_img_url}" alt="${item.book.title}" width="100" height="100" style="border-radius: 4px; object-fit: contain"/>
        </td>
        <td>
          <p><strong>Tựa sách: ${item.book.title}</strong></p>
          <p>Số lượng: ${item.quantity}</p>
          <p>Giá: ${item.price} VND</p>
        </td>
      </tr>
    </table>
  `).join('');

  const htmlContent = `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
      <tr>
        <td align="center">
          <!-- Outer Container Table for Centering -->
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif; color: #333; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <!-- Logo Section -->
                <img src=${logo_url} alt="UTE Shop Logo" width="150" style="border-radius: 4px;"/>
              </td>
            </tr>
            <tr>
              <td>
                <p>Xin chào ${to},</p>
                <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Dưới đây là thông tin chi tiết về đơn hàng của bạn:</p>

                <h3 style="color: #0056b3;">Thông tin đơn hàng</h3>
                <p><strong>Mã đơn hàng:</strong> #${order.id}</p>
                <p><strong>Ngày đặt hàng:</strong> ${order.order_date}</p>

                <h3 style="color: #0056b3;">Thông tin sản phẩm</h3>
                ${bookDetails}

                <p><strong>Tổng thanh toán:</strong> ${order.total_price} VND</p>
                <p>Vui lòng chú ý điện thoại và xác nhận khi nhận hàng giúp UTE Shop.</p>

                <p>Trân trọng,</p>
                <p><strong>Đội ngũ UTE Shop</strong></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `Đơn hàng #${order.id} đang được giao đến bạn !`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order details email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending order details email to ${to}:`, error);
    throw new Error('Error sending order details email');
  }
};

module.exports = {
  sendEmail,
  generateVerificationCode,
  sendOrderDetailsEmail
};