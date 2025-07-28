const { Category, Book, Author, Publisher, Genre } = require('../../src/models');

const createTestData = async () => {
  // Tạo test categories
  const category1 = await Category.create({
    name: 'Fiction',
    image_url: 'https://example.com/fiction.jpg'
  });

  const category2 = await Category.create({
    name: 'Science',
    image_url: 'https://example.com/science.jpg'
  });

  // Tạo test author
  const author = await Author.create({
    name: 'Test Author'
  });

  // Tạo test publisher
  const publisher = await Publisher.create({
    name: 'Test Publisher'
  });

  // Tạo test genre
  const genre = await Genre.create({
    name: 'Adventure'
  });

  // Tạo test books
  const book1 = await Book.create({
    ISBN: '1234567890',
    title: 'Test Book 1',
    desc: 'Description 1',
    price: 100000,
    salePrice: 80000,
    year: 2024,
    age: 18,
    stock: 10,
    cover_img_url: 'https://example.com/book1.jpg',
    author_id: author.id,
    publisher_id: publisher.id,
    category_id: category1.id
  });

  const book2 = await Book.create({
    ISBN: '0987654321',
    title: 'Test Book 2',
    desc: 'Description 2',
    price: 150000,
    salePrice: 120000,
    year: 2023,
    age: 16,
    stock: 5,
    cover_img_url: 'https://example.com/book2.jpg',
    author_id: author.id,
    publisher_id: publisher.id,
    category_id: category1.id
  });

  const book3 = await Book.create({
    ISBN: '5555555555',
    title: 'Science Book',
    desc: 'Science Description',
    price: 200000,
    salePrice: 180000,
    year: 2024,
    age: 20,
    stock: 8,
    cover_img_url: 'https://example.com/science.jpg',
    author_id: author.id,
    publisher_id: publisher.id,
    category_id: category2.id
  });

  return {
    categories: [category1, category2],
    books: [book1, book2, book3],
    author,
    publisher,
    genre
  };
};

module.exports = { createTestData };