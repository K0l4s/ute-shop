const db = require("../models");
const { Op, where } = require("sequelize");

// Hàm lấy danh sách danh mục
const getCategories = async () => {
  try {
    return await db.Category.findAll().include("books");
  } catch (error) {
    throw error;
  }
};

// Hàm lấy thông tin danh mục
const getCategory = async (id) => {
  try {
    return await db.Category.findByPk(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
    getCategories,
    getCategory,
};
