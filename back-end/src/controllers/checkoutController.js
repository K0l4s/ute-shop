const EncryptionService = require('../services/encryptionService.js');

const encodeCartData = (req, res) => {
  const { selectedItems, shipping_method, payment_method, totalAmount } = req.body;
  if (!selectedItems || !Array.isArray(selectedItems)) {
    return res.status(400).json({ message: "Invalid items" });
  }

  try {
    const encryptedData = EncryptionService.encrypt({selectedItems, shipping_method, payment_method, totalAmount});
    res.cookie('ck_data', encryptedData, {
      httpOnly: true,
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

module.exports = {
  encodeCartData,
  decodeCartData
}