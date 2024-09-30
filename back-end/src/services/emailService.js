const nodemailer = require('nodemailer');

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

module.exports = {
  sendEmail,
  generateVerificationCode
};