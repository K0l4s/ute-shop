const { getAllCategories, getPaginatedCategories, getPaginatedBooksByCategory } = require("../services/categoryService");

const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPaginatedCategoriesController = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const categories = await getPaginatedCategories(pageNum, limitNum);
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPaginatedBooksByCategoryController = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 8;
    const books = await getPaginatedBooksByCategory(categoryId, pageNum, limitNum);
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllCategoriesController,
  getPaginatedCategoriesController,
  getPaginatedBooksByCategoryController,
};