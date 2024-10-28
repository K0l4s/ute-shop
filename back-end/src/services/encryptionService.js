const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.JWT_SECRET_KEY || "secret_key";
// Vector khoi tao IV cố định
const FIXED_IV = CryptoJS.enc.Hex.parse("00000000000000000000000000000000"); // 16 bytes

class EncryptionService {
  static encrypt(data) {
    // Sử dụng IV cố định trong quá trình mã hóa
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, { iv: FIXED_IV });
    return encrypted.toString();
  }

  static decrypt(cipherText) {
    try {
      // Sử dụng IV cố định trong quá trình giải mã
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, { iv: FIXED_IV });
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedData) {
        throw new Error("Decryption failed");
      }
      return decryptedData;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Decryption failed");
    }
  }
}

module.exports = EncryptionService;
