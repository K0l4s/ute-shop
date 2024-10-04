const db = require("../models");
const Book = db.Book;
const Genre = db.Genre;
const Author = db.Author;
const Publisher = db.Publisher;
const Review = db.Review;
const Image = db.Image;
const User = db.User;
const { Op } = require("sequelize");

// Hàm tìm kiếm sách theo tiêu đề
const searchBooksByTitle = async (title) => {
  try {
    // Kiểm tra nếu không có tiêu đề
    if (!title) {
      throw new Error("Title is required");
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
      return null;
    }
    return books;
  } catch (error) {
    throw error;
  }
};
const getBookDetailById = async (id) => {
  try {
    // Kiểm tra nếu không có id
    if (!id) {
      throw new Error("Id is required");
    }
    // Tìm sách theo id
    const book = await Book.findByPk(id, {
      include: [
        {
          model: Genre,
          as: 'genres',
          attributes: ['name'],  // Lấy thông tin thể loại
          through: { attributes: [] }  // Không lấy dữ liệu bảng trung gian
        },
        {
          model: Author
        },
        {
          model: Publisher
        },
        {
          model: Review,
          include: [
            {
              model: User, 
              attributes: ['firstname', 'lastname', 'avatar_url'],  
            }
          ]
        },
        {
          model: Image,
          attributes: ['url'],
        }
      ]
    });
    // Kiểm tra nếu không tìm thấy sách
    if (!book) {
      return null;
    }
    return book;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  searchBooksByTitle,
  getBookDetailById
};
