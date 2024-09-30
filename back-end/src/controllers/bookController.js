const { searchBooksByTitle,getBookDetailById } = require("../services/bookService.js");

// Controller tìm kiếm sách theo tiêu đề
const searchBooksByTitleController = async (req, res) => {
  const { title } = req.query;
  try {
    const books = await searchBooksByTitle(title);
    // Kiểm tra nếu không tìm thấy sách nào
    if (!books) {
      return res.status(404).json({ message: "Not found" });
    }
    // Trả về kết quả tìm kiếm thành công
    return res.status(200).json({
      message: "success",
      data: books
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
  searchBooksByTitleController,
  getBookDetailByIdController
};
