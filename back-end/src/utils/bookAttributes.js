const getBookAttributes = (sequelize) => {
  return {
    include: [
      // Total sold quantity (with order status filter)
      [
        sequelize.literal(`(
          SELECT SUM(Detail_Orders.quantity)
          FROM Detail_Orders
          INNER JOIN Orders ON Detail_Orders.order_id = Orders.id
          WHERE Detail_Orders.book_id = Book.id 
            AND Orders.status NOT IN ('CANCELLED', 'RETURNED')
        )`),
        'total_sold'
      ],
      // Average rating
      [
        sequelize.literal(`(
          SELECT AVG(Reviews.star)
          FROM Reviews
          WHERE Reviews.book_id = Book.id
        )`),
        'avgRating'
      ],
      // Review count
      [
        sequelize.literal(`(
          SELECT COUNT(Reviews.id)
          FROM Reviews
          WHERE Reviews.book_id = Book.id
        )`),
        'reviewCount'
      ],
      // Sold count by author (if needed)
      [
        sequelize.literal(`(
          SELECT COUNT(*)
          FROM Books AS BookSold
          WHERE BookSold.author_id = Book.author_id
        )`),
        'sold_count'
      ]
    ]
  };
};

// Common includes for book queries
const getBookIncludes = (db) => {
  return [
    {
      model: db.Publisher,
      attributes: ['name']
    },
    {
      model: db.Author,
      attributes: ['name']
    },
    {
      model: db.Genre,
      as: 'genres',
      attributes: ['name'],
      through: { attributes: [] }
    },
    {
      model: db.Review,
      as: 'Reviews',
      attributes: [],
      include: [
        {
          model: db.User,
          attributes: ['firstName', 'lastName']
        }
      ]
    },
    {
      model: db.Image,
      as: 'Images',
      attributes: ['url']
    }
  ];
};

// Minimal includes (without reviews and images for performance)
const getBookIncludesMinimal = (db) => {
  return [
    {
      model: db.Publisher,
      attributes: ['name']
    },
    {
      model: db.Author,
      attributes: ['name']
    },
    {
      model: db.Genre,
      as: 'genres',
      attributes: ['name'],
      through: { attributes: [] }
    }
  ];
};

module.exports = {
  getBookAttributes,
  getBookIncludes,
  getBookIncludesMinimal
};