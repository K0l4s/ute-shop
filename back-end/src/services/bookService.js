const db = require("../models");
const Book = db.Book;
const Genre = db.Genre;
const Author = db.Author;
const Publisher = db.Publisher;
const Review = db.Review;
const Image = db.Image;
const User = db.User;
const Order = db.Order;
const sequelize = db.sequelize;
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

// const getTop10BooksByOrderQuantity = async () => {
//   try {
//     // Tìm 10 sách được mua nhiều nhất biết rằng book có quan hệ với order thông qua bảng Order. Một order có 1 sách, 1 sách có nhiều order
//     const books = await Book.findAll({
//       include: [
//         {
//           model: Order,
//           attributes: [[db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'total_quantity']],  // Tính tổng số lượng sách đã mua
//           group: ['Order.book_id'],  // Nhóm theo book_id
//           order: [[db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'DESC']],  // Sắp xếp giảm dần theo tổng số lượng sách đã mua
//           limit: 10
//         }
//       ]
//     });
//     return books;
//   } catch (error) {
//     throw error;
//   }
// };
const getTop10BooksByOrderQuantity = async () => {
  try{
  const topBooksQuery = `
      SELECT 
        Books.id, 
        Books.ISBN, 
        Books.title, 
        Books.desc, 
        Books.price, 
        Books.salePrice, 
        Books.year, 
        Books.stock, 
        Books.cover_img_url, 
        Books.publisher_id, 
        Books.author_id, 
        Books.category_id, 
        SUM(Orders.quantity) AS totalSell 
      FROM Books 
      LEFT JOIN Orders ON Books.id = Orders.book_id 
      GROUP BY Books.id 
      ORDER BY totalSell DESC 
      LIMIT 10;
    `;

    const [topBooks, metadata] = await sequelize.query(topBooksQuery);
    if (topBooks.length === 0) {
      throw new Error('Cant find any book');
    }
    return topBooks;
  } catch (error) {
    console.error('Error fetching top 10 books by order quantity:', error);
    throw error; // Rethrow error after logging
  }
}


module.exports = {
  searchBooksByTitle,
  getBookDetailById,
  getTop10BooksByOrderQuantity
};
