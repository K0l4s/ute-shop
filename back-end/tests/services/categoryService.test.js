const categoryService = require('../../src/services/categoryService');
const { createTestData } = require('../utils/testData');

describe('CategoryService', () => {
  let testData;

  beforeEach(async () => {
    testData = await createTestData();
  });

  describe('getAllCategories', () => {
    it('should return all categories successfully', async () => {
      const categories = await categoryService.getAllCategories();
      
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories).toHaveLength(2);
      expect(categories[0]).toHaveProperty('name');
      expect(categories[0]).toHaveProperty('image_url');
    });

    it('should return empty array when no categories exist', async () => {
      // Xóa tất cả categories
      const { Category } = require('../../src/models');
      await Category.destroy({ where: {}, force: true });

      const categories = await categoryService.getAllCategories();
      
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories).toHaveLength(0);
    });
  });

  describe('getPaginatedCategories', () => {
    it('should return paginated categories with correct structure', async () => {
      const result = await categoryService.getPaginatedCategories(1, 1);
      
      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('totalPages');
      
      expect(result.categories).toHaveLength(1);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
    });

    it('should handle pagination correctly', async () => {
      const page1 = await categoryService.getPaginatedCategories(1, 1);
      const page2 = await categoryService.getPaginatedCategories(2, 1);
      
      expect(page1.categories[0].id).not.toBe(page2.categories[0].id);
      expect(page1.totalPages).toBe(2);
      expect(page2.totalPages).toBe(2);
    });

    it('should calculate total pages correctly', async () => {
      const result = await categoryService.getPaginatedCategories(1, 3);
      
      expect(result.totalPages).toBe(1); // 2 categories / 3 per page = 1 page
    });
  });

  describe('getPaginatedBooksByCategory', () => {
    it('should return books for valid category ID', async () => {
      const categoryId = testData.categories[0].id;
      const result = await categoryService.getPaginatedBooksByCategory(categoryId, 1, 10);
      
      expect(result).toHaveProperty('books');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('totalPages');
      
      expect(result.books).toHaveLength(2); // 2 books in category 1
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });

    it('should throw error for missing category ID', async () => {
      await expect(
        categoryService.getPaginatedBooksByCategory(null, 1, 10)
      ).rejects.toThrow('Category ID is required');

      await expect(
        categoryService.getPaginatedBooksByCategory(undefined, 1, 10)
      ).rejects.toThrow('Category ID is required');
    });

    it('should include proper book associations', async () => {
      const categoryId = testData.categories[0].id;
      const result = await categoryService.getPaginatedBooksByCategory(categoryId, 1, 10);
      
      const book = result.books[0];
      expect(book).toHaveProperty('Publisher');
      expect(book).toHaveProperty('Author');
      expect(book).toHaveProperty('genres');
      
      expect(book.Publisher).toHaveProperty('name');
      expect(book.Author).toHaveProperty('name');
    });

    it('should include calculated attributes', async () => {
      const categoryId = testData.categories[0].id;
      const result = await categoryService.getPaginatedBooksByCategory(categoryId, 1, 10);
      
      const book = result.books[0];
      expect(book.dataValues).toHaveProperty('total_sold');
      expect(book.dataValues).toHaveProperty('avgRating');
      expect(book.dataValues).toHaveProperty('reviewCount');
    });

    it('should handle pagination correctly', async () => {
      const categoryId = testData.categories[0].id;
      
      const page1 = await categoryService.getPaginatedBooksByCategory(categoryId, 1, 1);
      const page2 = await categoryService.getPaginatedBooksByCategory(categoryId, 2, 1);
      
      expect(page1.books).toHaveLength(1);
      expect(page2.books).toHaveLength(1);
      expect(page1.books[0].id).not.toBe(page2.books[0].id);
      expect(page1.totalPages).toBe(2);
    });

    it('should return empty result for non-existent category', async () => {
      const result = await categoryService.getPaginatedBooksByCategory(99999, 1, 10);
      
      expect(result.books).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should order books by title ascending', async () => {
      const categoryId = testData.categories[0].id;
      const result = await categoryService.getPaginatedBooksByCategory(categoryId, 1, 10);
      
      const titles = result.books.map(book => book.title);
      const sortedTitles = [...titles].sort();
      expect(titles).toEqual(sortedTitles);
    });
  });
});