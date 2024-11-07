const { getBooks, getBookDetailById, getTop10BooksByOrderQuantity, createNewBook } = require("../services/bookService.js");
const { uploadBookImage } = require("../services/uploadService.js");
// const { createBook } = require("../services/bookService.js");
const { uploadBookService } = require("../services/uploadService.js");
// Controller tìm kiếm và lọc sách với phân trang
const getBooksController = async (req, res) => {
  const { title, minPrice, maxPrice, publisher, minAge, maxAge, sortByPrice, page, limit } = req.query;
  try {
    const filters = { title, minPrice, maxPrice, publisher, minAge, maxAge, sortByPrice };
    const currentPage = parseInt(page, 10) || 1;
    const booksPerPage = parseInt(limit, 10) || 16;

    const result = await getBooks(filters, currentPage, booksPerPage);

    return res.status(200).json({
      message: "success",
      data: result.books,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const multer = require('multer');

// Khởi tạo multer để xử lý file upload
const upload = multer({
  storage: multer.memoryStorage() // hoặc bạn có thể tùy chỉnh nếu cần
});

const createBookController = async (req, res) => {
  // getdata form FromData
  const { ISBN, title, desc, price, salePrice, year, age, stock, author_id } = req.body;
     console.log(req.body);
  try {
    let cover_img_url = null;
    if (req.file) {
      cover_img_url = await uploadBookImage(req, res); // Nhận URL từ Cloudinary
    }
    const book = await createNewBook({ISBN, title, desc, price, salePrice, year, age, stock,cover_img_url, author_id});
    return res.status(201).json({
      message: "success",
      data: book
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getBookDetailByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await getBookDetailById(id);
    // Kiểm tra nếu không tìm thấy sách
    if (!book) {
      return res.status(404).json({ message: "Not found" });
    }
    // Trả về kết quả tìm kiếm thành công
    return res.status(200).json({
      message: "success",
      data: book
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getTop10Books = async (req, res) => {
  try {
    const books = await getTop10BooksByOrderQuantity();
    return res.status(200).json({
      message: "success",
      data: books
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
module.exports = {
  getBooksController,
  getBookDetailByIdController,
  getTop10Books,
  createBookController
};