const db = require('../models');
const { getBookAttributes } = require('../utils/bookAttributes');
const Book = db.Book;
const Category = db.Category;
const Publisher = db.Publisher;

// func to get all categories
const getAllCategories = async () => {
  try {
    const categories = await Category.findAll();
    return categories;
  } catch (error) {
    throw error;
  }
}

// func to get paginated categories
const getPaginatedCategories = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await Category.findAndCountAll({
      offset,
      limit
    });
    return { 
      categories: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit) 
    };
  } catch (error) {
    throw error;
  }
}

// func to get paginated books by category
const getPaginatedBooksByCategory = async ( categoryId, page, limit) => {
  try {
    if (!categoryId) throw new Error('Category ID is required');
    
    const offset = (page - 1) * limit;
    const { count, rows } = await Book.findAndCountAll({
      where: {
        category_id: categoryId
      },
      include: [
        {
          model: Publisher,
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
      ],
      attributes: getBookAttributes(db.sequelize),
      offset,
      limit,
      order: [['title', 'ASC']]
    });
    return {
      books: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllCategories,
  getPaginatedCategories,
  getPaginatedBooksByCategory
};
