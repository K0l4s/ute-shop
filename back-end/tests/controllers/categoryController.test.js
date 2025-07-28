const request = require('supertest');
const express = require('express');
const categoryController = require('../../src/controllers/categoryController');
const categoryService = require('../../src/services/categoryService');

// Mock categoryService
jest.mock('../../src/services/categoryService');

const app = express();
app.use(express.json());

// Setup routes for testing
app.get('/categories', categoryController.getPaginatedCategoriesController);
app.get('/categories/:categoryId', categoryController.getPaginatedBooksByCategoryController);

describe('CategoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPaginatedCategoriesController', () => {
    it('should return paginated categories with default params', async () => {
      const mockData = {
        categories: [
          { id: 1, name: 'Fiction', image_url: 'fiction.jpg' },
          { id: 2, name: 'Science', image_url: 'science.jpg' }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      };

      categoryService.getPaginatedCategories.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/categories')
        .expect(200);

      expect(response.body).toEqual(mockData);
      expect(categoryService.getPaginatedCategories).toHaveBeenCalledWith(1, 10);
    });

    it('should parse page and limit from query params', async () => {
      const mockData = {
        categories: [],
        total: 0,
        page: 2,
        totalPages: 0
      };

      categoryService.getPaginatedCategories.mockResolvedValue(mockData);

      await request(app)
        .get('/categories?page=2&limit=5')
        .expect(200);

      expect(categoryService.getPaginatedCategories).toHaveBeenCalledWith(2, 5);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Database connection failed';
      categoryService.getPaginatedCategories.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get('/categories')
        .expect(500);

      expect(response.body).toEqual({ error: errorMessage });
    });

    it('should handle invalid page and limit params', async () => {
      const mockData = {
        categories: [],
        total: 0,
        page: 1,
        totalPages: 0
      };

      categoryService.getPaginatedCategories.mockResolvedValue(mockData);

      await request(app)
        .get('/categories?page=invalid&limit=notANumber')
        .expect(200);

      // Should use default values when params are invalid
      expect(categoryService.getPaginatedCategories).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getPaginatedBooksByCategoryController', () => {
    it('should return books for valid category ID', async () => {
      const mockData = {
        books: [
          {
            id: 1,
            title: 'Test Book',
            price: 100000,
            Publisher: { name: 'Test Publisher' },
            Author: { name: 'Test Author' }
          }
        ],
        total: 1,
        page: 1,
        totalPages: 1
      };

      categoryService.getPaginatedBooksByCategory.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/categories/1')
        .expect(200);

      expect(response.body).toEqual(mockData);
      expect(categoryService.getPaginatedBooksByCategory).toHaveBeenCalledWith('1', 1, 8);
    });

    it('should parse query parameters with defaults', async () => {
      const mockData = { books: [], total: 0, page: 1, totalPages: 0 };
      categoryService.getPaginatedBooksByCategory.mockResolvedValue(mockData);

      await request(app)
        .get('/categories/1?page=2&limit=12')
        .expect(200);

      expect(categoryService.getPaginatedBooksByCategory).toHaveBeenCalledWith('1', 2, 12);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Category ID is required';
      categoryService.getPaginatedBooksByCategory.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get('/categories/invalid')
        .expect(500);

      expect(response.body).toEqual({ error: errorMessage });
    });

    it('should use default pagination values for invalid params', async () => {
      const mockData = { books: [], total: 0, page: 1, totalPages: 0 };
      categoryService.getPaginatedBooksByCategory.mockResolvedValue(mockData);

      await request(app)
        .get('/categories/1?page=abc&limit=xyz')
        .expect(200);

      expect(categoryService.getPaginatedBooksByCategory).toHaveBeenCalledWith('1', 1, 8);
    });

    it('should handle non-existent category', async () => {
      const mockData = { books: [], total: 0, page: 1, totalPages: 0 };
      categoryService.getPaginatedBooksByCategory.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/categories/99999')
        .expect(200);

      expect(response.body).toEqual(mockData);
      expect(categoryService.getPaginatedBooksByCategory).toHaveBeenCalledWith('99999', 1, 8);
    });
  });

  describe('getAllCategoriesController', () => {
    it('should return all categories successfully', async () => {
      const mockCategories = [
        { id: 1, name: 'Fiction', image_url: 'fiction.jpg' },
        { id: 2, name: 'Science', image_url: 'science.jpg' }
      ];

      categoryService.getAllCategories.mockResolvedValue(mockCategories);

      // Since we don't have route for getAllCategories, we'll test the controller directly
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await categoryController.getAllCategoriesController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
      expect(categoryService.getAllCategories).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Database error';
      categoryService.getAllCategories.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await categoryController.getAllCategoriesController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});