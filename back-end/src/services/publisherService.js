const db = require("../models");
const Publisher = db.Publisher;
const Book = db.Book;
const getPublishers = async () => {
  try {
    // return Publisher.findAll();
    // Lấy tất cả nhà xuất bản và đếm số lượng sách của mỗi nhà xuất bản
    return Publisher.findAll({
      attributes: ['id', 'name', 'address'],
      // đếm số sách của mỗi nxb
      include: [
        {
          model: Book,
          as: 'books',
          attributes: ['id', 'title'],
          required: false
        }
      ]

    });
  }
  catch (error) {
    throw new Error(error);
  }
}
const createPublisher = async ({name,address}) => {
  try {
    const publisher = {
      name,
      address
    }
    return Publisher.create(publisher);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getPublishers,
  createPublisher
}