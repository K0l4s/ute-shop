const db = require("../models");
const Book = db.Book;
const Genre = db.Genre;
const Publisher = db.Publisher;
const Order = db.Order;
const User = db.User;
const Detail_Order = db.Detail_Order;
const Author = db.Author;
const Image = db.Image;
const Review = db.Review;
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const getTop10BooksByOrderQuantity = async () => {
  try {
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
        (SELECT SUM(detail_orders.quantity)
         FROM detail_orders 
         INNER JOIN Orders ON detail_orders.order_id = Orders.id
         WHERE detail_orders.book_id = Books.id 
           AND Orders.status NOT IN ('CANCELLED', 'RETURNED')
        ) AS totalSell, 
        AVG(Reviews.star) AS avgRating,
        COUNT(Reviews.id) AS reviewCount
FROM Books 
LEFT JOIN Reviews ON Books.id = Reviews.book_id
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
// Hàm tìm kiếm và lọc sách với phân trang
const getBooks = async (filters, page = 1, limit = 16) => {
  try {
    const { title, minPrice, maxPrice, publisher, minAge, maxAge, sortByPrice } = filters;

    // Thiết lập điều kiện tìm kiếm
    const whereClause = {
      stock: {
        [Op.gt]: 0 // gt = greater than
      }
    };
    
    // Tìm kiếm theo tiêu đề nếu có
    if (title) {
      whereClause.title = { [Op.like]: `%${title}%` };
    }

    // Lọc theo khoảng giá nếu có
    if (minPrice || maxPrice) {
      whereClause[Op.or] = [
        {
          salePrice: {
        ...(minPrice ? { [Op.gte]: minPrice } : {}),
        ...(maxPrice ? { [Op.lte]: maxPrice } : {}),
          }
        },
        {
          price: {
        ...(minPrice ? { [Op.gte]: minPrice } : {}),
        ...(maxPrice ? { [Op.lte]: maxPrice } : {}),
          }
        }
      ];
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

    // Decode the publisher
    const decodedPublisher = publisher ? decodeURIComponent(publisher) : null;
    // Sử dụng include với where để áp dụng điều kiện lọc publisher
    const includePublisher = {
      model: Publisher,
      attributes: ['name'],
      ...(decodedPublisher ? { where: { name: { [Op.eq]: decodedPublisher } } } : {}),
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
          model: Publisher,
          attributes: ['name'],
          ...(decodedPublisher ? { where: { name: { [Op.eq]: decodedPublisher } } } : {}),
        },
        {
          model: Genre,
          as: 'genres', // Alias for Genre association
          attributes: ['name'],
          through: { attributes: [] } // Don't include the join table data
        },
        {
          model: Author,
          as: 'Author' // Ensure this matches the association alias
        },
        // {
        //   model: Publisher,
        //   as: 'Publisher' // Ensure this matches the association alias
        // },
        {
          model: Review,
          as: 'Reviews', // Ensure this matches the association alias
          include: [
            {
              model: User,
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: Image,
          as: 'Images', // Ensure this matches the association alias
          attributes: ['url']
        },
        // Add any other includes as necessary
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Books AS BookSold
              WHERE BookSold.author_id = Book.author_id
            )`),
            'sold_count'
          ],
          [
            sequelize.literal(`(
              SELECT SUM(detail_orders.quantity)
              FROM detail_orders
              WHERE detail_orders.book_id = Book.id
            )`),
            'total_sold'
          ],
          [
            sequelize.literal(`(
              SELECT AVG(Reviews.star)
              FROM Reviews
              WHERE Reviews.book_id = Book.id
            )`),
            'avgRating'
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(Reviews.id)
              FROM Reviews
              WHERE Reviews.book_id = Book.id
            )`),
            'reviewCount'
          ]
        ]
      },
      order: order,
      offset: offset,
      limit: limit,
    });

    return {
      books: books,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};

const getBookDetailById = async (id) => {
  try {
    // Check if ID is provided
    if (!id) {
      throw new Error("Id is required");
    }

    // Fetch book details by ID
    const book = await Book.findByPk(id, {
      include: [
        {
          model: Genre,
          as: 'genres', // Alias for Genre association
          attributes: ['name'],
          through: { attributes: [] } // Don't include the join table data
        },
        {
          model: Author,
          as: 'Author' // Ensure this matches the association alias
        },
        {
          model: Publisher,
          as: 'Publisher' // Ensure this matches the association alias
        },
        {
          model: Review,
          as: 'Reviews', // Ensure this matches the association alias
          include: [
            {
              model: User,
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: Image,
          as: 'Images', // Ensure this matches the association alias
          attributes: ['url']
        },
        // Add any other includes as necessary
      ],
      attributes: {
        include: [
          [
            db.sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Books
                    WHERE Books.author_id = Author.id
                )`),
            'sold_count'
          ]
        ]
      }
    });
    const totalSold = await Detail_Order.sum('quantity', {
      where: {
        book_id: id
      }
    });
    // console.log(totalSold);
    // add totalSold to book
    book.sold = totalSold;
    // console.log(book);
    // Check if the book was found
    if (!book) {
      return null;
    }
    return book;
  } catch (error) {
    throw error;
  }
};
const createNewBook = async ({ ISBN,
  title,
  desc,
  price,
  salePrice,
  year,
  age,
  stock, cover_img_url,
  author_id,
  publisher_id }) => {
  try {
    // Check if required fields are provided
    // if (!ISBN || !title || !price || !salePrice || !year || !age || !stock) {
    //   throw new Error("ISBN, title, price, salePrice, year, age, stock are required");
    // }
    // Create new book
    console.log(ISBN);
    const book = {
      ISBN,
      title,
      desc,
      price,
      salePrice,
      year,
      age,
      stock,
      cover_img_url,
      author_id,
      publisher_id
    }
    const newBook = await Book.create(book);
    return newBook;
  } catch (error) {
    throw error;
  }
};
// const getTotalSoldBookById = async (id) => {
//   try {
//     // Check if ID is provided
//     if (!id) {
//       throw new Error("Id is required");
//     }

//     // Fetch total sold book by ID
//     const totalSold = await Detail_Order.sum('quantity', {
//       where: {
//         book_id: id
//       }
//     });

//     return totalSold;
//   } catch (error) {
//     throw error;
//   }
// }
const updateBookService = async (id, book) => {
  try {
    // Check if ID is provided
    if (!id) {
      throw new Error("Id is required");
    }

    // Update book by ID
    const updatedBook = await Book.update(book, {
      where: {
        id: id
      }
    });

    return updatedBook;
  } catch (error) {
    throw error;
  }
}

const getBooksByListId = async (ids) => {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error("A list of IDs is required");
    }

    const books = await Book.findAll({
      attributes: {
        include: [
          [
            sequelize.fn('AVG', sequelize.col('Reviews.star')),
            'avgRating'
          ],
          [
            sequelize.fn('COUNT', sequelize.col('Reviews.id')),
            'reviewCount'
          ]
        ]
      },
      where: {
        id: {
          [Op.in]: ids
        }
      },
      include: [
        {
          model: Genre,
          as: 'genres',
          attributes: ['name'],
          through: { attributes: [] }
        },
        {
          model: Publisher,
          as: 'Publisher'
        },
        {
          model: Review,
          as: 'Reviews',
          attributes: [] // Exclude individual review attributes
        }
      ],
      group: ['Book.id', 'genres.id']
    });

    // Check if books were found
    if (!books || books.length === 0) {
      return [];
    }

    return books;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  // searchBooksByTitle,
  getTop10BooksByOrderQuantity,
  getBooks,
  getBookDetailById,
  createNewBook,
  getBooksByListId
};

