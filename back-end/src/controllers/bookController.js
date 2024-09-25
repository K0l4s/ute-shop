import Book from "../models/book.js";
import Genre from "../models/genre.js";
// import {models} from "../models";
import { Op } from "sequelize";

// Hàm tìm kiếm sách theo tên
export const searchBooksByTitle = async (req, res) => {
  const { title } = req.query;

  try {
    // Kiểm tra nếu không có tiêu đề
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Tìm sách theo tiêu đề
    const books = await Book.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`  // Tìm kiếm tiêu đề chứa từ khóa
        }
      },
      include: [
        {
          model: Genre,
          as: 'genres',
          attributes: ['name'],  // Lấy thông tin thể loại
          through: { attributes: [] }  // Không lấy dữ liệu bảng trung gian
        }
      ]
    });

    // Kiểm tra nếu không tìm thấy sách nào
    if (books.length === 0) {
      return res.status(404).json({ message: "not found" });
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
