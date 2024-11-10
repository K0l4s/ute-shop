const db = require('../models');
const Book = db.Book;
const Discount = db.Discount;
const FreeShip = db.Freeship;

const EncryptionService = require('../services/encryptionService.js');

const encodeCartData = (req, res) => {
  const { selectedItems, shipping_method, payment_method, totalAmount, discountVoucher, freeshipVoucher } = req.body;
  if (!selectedItems || !Array.isArray(selectedItems)) {
    return res.status(400).json({ message: "Invalid items" });
  }

  try {
    const encryptedData = EncryptionService.encrypt({
      selectedItems, 
      shipping_method, 
      payment_method, 
      totalAmount,
      discountVoucher,
      freeshipVoucher
    });
    res.cookie('ck_data', encryptedData, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'development',
      maxAge: 8 * 60 * 60 * 1000,
      sameSite: 'None' // allow cookies to enable cross-site usage (virtual domain)
    });
    return res.json({ encryptedData });
  } catch (error) {
    console.error("Encryption error:", error);
    return res.status(500).json({ message: "Failed to encrypt cart data" });
  }
};

const decodeCartData = (req, res) => {
  const encodedData = req.query.data || req.cookies.ck_data;
  const normalizedData = encodedData.replace(/ /g, '+'); // Chuyển khoảng trắng lại thành dấu '+'
  const decodedDataFromURI = decodeURIComponent(normalizedData);
  if (!encodedData) {
    return res.status(400).json({ message: "Missing encoded data" });
  }

  try {
    const decodedData = EncryptionService.decrypt(decodedDataFromURI);
    const parsedData = JSON.parse(decodedData);
    console.log(parsedData);
    return res.json({ decodedData: parsedData });
  } catch (error) {
    console.error("Decryption error:", error);
    return res.status(500).json({ message: "Failed to decrypt cart data" });
  }
};

const reserveStock = async (req, res) => {
  const { selectedItems } = req.body;

  try {
    // Kiểm tra và đặt trước số lượng sách
    for (const item of selectedItems) {
      const book = await Book.findByPk(item.id);
      if (!book || book.stock < item.quantity) {
        throw new Error(`Book ${item.name} is out of stock`);
      }
      book.stock -= item.quantity;
      await book.save();
    }

    res.status(200).json({ message: 'Stock reserved successfully' });
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(400).json({ message: error.message });
  }
};

const releaseStock = async (req, res) => {
  const { selectedItems } = req.body;

  try {
    // Hoàn trả lại số lượng sách
    for (const item of selectedItems) {
      const book = await Book.findByPk(item.id);
      book.stock += item.quantity;
      await book.save();
    }

    res.status(200).json({ message: 'Stock and vouchers released successfully' });
  } catch (error) {
    console.error('Release error:', error);
    res.status(400).json({ message: error.message });
  }
};

const checkStockAndVoucherAvailability = async (req, res) => {
  const { selectedItems, discountVoucher, freeshipVoucher } = req.body;

  try {
    // Kiểm tra số lượng sách
    for (const item of selectedItems) {
      const book = await Book.findByPk(item.id);
      if (!book || book.stock < item.quantity) {
        return res.status(400).json({ message: `Sách ${item.name} đã hết hàng` });
      }
    }

    // Kiểm tra số lượng voucher giảm giá
    if (discountVoucher) {
      const discount = await Discount.findByPk(discountVoucher.id);
      if (!discount || discount.stock < 1) {
        return res.status(400).json({ message: `Mã giảm giá ${discountVoucher.code} đã hết. Vui lòng đổi mã!` });
      }
    }

    // Kiểm tra số lượng voucher freeship
    if (freeshipVoucher) {
      const freeship = await FreeShip.findByPk(freeshipVoucher.id);
      if (!freeship || freeship.stock < 1) {
        return res.status(400).json({ message: `Mã giảm vận chuyển ${freeshipVoucher.code} đã hết. Vui lòng đổi mã!` });
      }
    }

    res.status(200).json({ message: 'Stock and vouchers are available' });
  } catch (error) {
    console.error('Stock and voucher availability check error:', error);
    res.status(500).json({ message: 'Failed to check stock and voucher availability' });
  }
};

module.exports = {
  encodeCartData,
  decodeCartData,
  reserveStock,
  releaseStock,
  checkStockAndVoucherAvailability
}