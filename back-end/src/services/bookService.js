const db = require("../models");
const Book = db.Book;
const Genre = db.Genre;
const Publisher = db.Publisher;
const Order = db.Order;
const sequelize = db.sequelize;
const { Op } = require("sequelize");

// Hàm tìm kiếm và lọc sách với phân trang
const getBooks = async (filters, page = 1, limit = 16) => {
  try {
    const { title, minPrice, maxPrice, publisher, minAge, maxAge, sortByPrice } = filters;

    // Thiết lập điều kiện tìm kiếm
    const whereClause = {};

    // Tìm kiếm theo tiêu đề nếu có
    if (title) {
      whereClause.title = { [Op.like]: `%${title}%` };
    }

    // Lọc theo khoảng giá nếu có
    if (minPrice || maxPrice) {
      whereClause.price = {
        ...(minPrice ? { [Op.gte]: minPrice } : {}),
        ...(maxPrice ? { [Op.lte]: maxPrice } : {}),
      };
    }

    // Lọc theo khoảng độ tuổi nếu có
    if (minAge || maxAge) {

      whereClause.age = {
        ...(minAge ? { [Op.gte]: minAge } : {}),
        ...(maxAge ? { [Op.lte]: maxAge } : {}),
      };
    }

    // Thiết lập sắp xếp
    let order = [];
    if (sortByPrice) {
      order.push(['price', sortByPrice === 'asc' ? 'ASC' : 'DESC']);
    }

    // Sử dụng include với where để áp dụng điều kiện lọc publisher
    const includePublisher = {
      model: Publisher,
      attributes: ['name'],
      ...(publisher ? { where: { name: { [Op.eq]: publisher } } } : {}),
    };

    // Lấy tổng số lượng sách thỏa mãn điều kiện
    const totalBooks = await Book.count({ where: whereClause, include: [includePublisher] });

    // Tính toán phân trang
    const totalPages = Math.ceil(totalBooks / limit);
    const offset = (page - 1) * limit;

    // Tìm sách với điều kiện lọc, phân trang và sắp xếp
    const books = await Book.findAll({
      where: whereClause,
      include: [
        {
          model: Genre,
          as: 'genres',
          attributes: ['name'],
          through: { attributes: [] },
        },
        includePublisher,
      ],
      order: order,
      offset: offset,
      limit: limit,
    });

    // Định dạng lại dữ liệu trước khi trả về
    const formattedBooks = books.map((book) => {
      return {
        id: book.id,
        ISBN: book.ISBN,
        title: book.title,
        desc: book.desc,
        price: book.price,
        salePrice: book.salePrice,
        year: book.year,
        age: book.age,
        sold: book.sold,
        stock: book.stock,
        cover_img_url: book.cover_img_url,
        genres: book.genres.map((genre) => genre.name),
        publisher: book.Publisher?.name || null,
      };
    });

    return {
      books: formattedBooks,
      currentPage: page,
      totalPages,
    };
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
        // {
        //   model: Review
        // },
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

