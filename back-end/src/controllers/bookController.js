const { getBooks, getBookDetailById } = require("../services/bookService.js");

// Controller tìm kiếm và lọc sách với phân trang
const getBooksController = async (req, res) => {
  const { title, minPrice, maxPrice, publisher, age, sortByPrice, page, limit } = req.query;
  try {
    const filters = { title, minPrice, maxPrice, publisher, age, sortByPrice };
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
module.exports = {
  getBooksController,
  getBookDetailByIdController
};