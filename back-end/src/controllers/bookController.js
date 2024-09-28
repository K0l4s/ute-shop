import { searchBooksByTitle } from "../services/bookService.js";


// Controller tìm kiếm sách theo tiêu đề
export const searchBooksByTitleController = async (req, res) => {
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
