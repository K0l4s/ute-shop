const express = require('express');
const { getPaginatedCategoriesController, getPaginatedBooksByCategoryController } = require('../controllers/categoryController');
const router = express.Router();

router.get('/', getPaginatedCategoriesController);
router.get('/:categoryId', getPaginatedBooksByCategoryController);

module.exports = router;