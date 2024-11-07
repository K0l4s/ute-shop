const db = require('../models');
const Discount = db.Discount;
const Freeship = db.Freeship;

//Hàm tạo discount 
const createDiscount = async ({ code, name, discount_val, discount_perc, min_order_val, desc, stock, is_active }) => {
  // Kiểm tra các giá trị âm
  if (discount_val < 0 || discount_perc < 0 || min_order_val < 0 || stock < 0) {
    throw new Error('Discount values must not be negative');
  }

  // Kiểm tra discount_perc nằm trong khoảng 0-100
  if (discount_perc < 1 || discount_perc > 100) {
    throw new Error('Discount percentage must be between 0 and 100');
  }  
  
  try {
      const newDiscount = await Discount.create({
        code,
        name,
        discount_val,
        discount_perc,
        min_order_val,
        desc,
        stock,
        is_active
      });
      return newDiscount;
    } catch (error) {
      throw new Error(`Failed to create discount: ${error.message}`);
    }
};

//Hàm lấy tất cả các discount hiện có 
const getAllDiscounts = async () => {
    try {
      const discounts = await Discount.findAll();
      if (discounts.length === 0) {
        throw new Error('No discounts found');
      }
      return discounts;
    } catch (error) {
      throw new Error(`Failed to retrieve discounts: ${error.message}`);
    }
  };

//Hàm tìm discount bằng code
const getDiscountByCode = async (code) => {
    try {
      const discount = await Discount.findOne({ where: { code } });
      if (!discount) {
        throw new Error(`Discount with code "${code}" not found`);
      }
      return discount;
    } catch (error) {
      throw new Error(`Failed to retrieve discount: ${error.message}`);
    }
};

//Hàm cập nhật discount
const updateDiscount = async (discountId, { code, name, discount_val, discount_perc, min_order_val, desc, stock, is_active }) => {
  // Kiểm tra các giá trị âm
  if (discount_val < 0 || discount_perc < 0 || min_order_val < 0 || stock < 0) {
    throw new Error('Discount values must not be negative');
  }

  // Kiểm tra discount_perc nằm trong khoảng 0-100
  if (discount_perc < 1 || discount_perc > 100) {
    throw new Error('Discount percentage must be between 0 and 100');
  }   
  try {
      const discount = await Discount.findByPk(discountId);
      if (!discount) {
        throw new Error(`Discount with ID ${discountId} not found`);
      }
      await discount.update({
        code,
        name,
        discount_val,
        discount_perc,
        min_order_val,
        desc,
        stock,
        is_active
      });
      return discount;
    } catch (error) {
      throw new Error(`Failed to update discount: ${error.message}`);
    }
};

//Hàm xóa discount
const deleteDiscount = async (discountId) => {
  try {
    const discount = await Discount.findByPk(discountId);
    if (!discount) {
      throw new Error(`Discount with ID ${discountId} not found`);
    }
    await discount.destroy();
    return { message: `Discount with ID ${discountId} deleted successfully` };
  } catch (error) {
    throw new Error(`Failed to delete discount: ${error.message}`);
  }
};

// Hàm tạo freeship
const createFreeship = async ({ code, name, discount_val, discount_perc, min_order_val, desc, stock, is_active }) => {
  // Kiểm tra các giá trị âm
  if (discount_val < 0 || discount_perc < 0 || min_order_val < 0 || stock < 0) {
      throw new Error('Freeship values must not be negative');
  }

  // Kiểm tra discount_perc nằm trong khoảng 0-100
  if (discount_perc < 0 || discount_perc > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
  }

  try {
      const newFreeship = await Freeship.create({
          code,
          name,
          discount_val,
          discount_perc,
          min_order_val,
          desc,
          stock,
          is_active
      });
      return newFreeship;
  } catch (error) {
      throw new Error(`Failed to create freeship: ${error.message}`);
  }
};
// Hàm lấy tất cả các freeship hiện có
const getAllFreeships = async () => {
  try {
      const freeships = await Freeship.findAll();
      if (freeships.length === 0) {
          throw new Error('No freeships found');
      }
      return freeships;
  } catch (error) {
      throw new Error(`Failed to retrieve freeships: ${error.message}`);
  }
};

// Hàm tìm freeship bằng code
const getFreeshipByCode = async (code) => {
  try {
      const freeship = await Freeship.findOne({ where: { code } });
      if (!freeship) {
          throw new Error(`Freeship with code "${code}" not found`);
      }
      return freeship;
  } catch (error) {
      throw new Error(`Failed to retrieve freeship: ${error.message}`);
  }
};

// Hàm cập nhật freeship
const updateFreeship = async (freeshipId, { code, name, discount_val, discount_perc, min_order_val, desc, stock, is_active }) => {
  try {
      const freeship = await Freeship.findByPk(freeshipId);
      if (!freeship) {
          throw new Error(`Freeship with ID ${freeshipId} not found`);
      }
      await freeship.update({
          code,
          name,
          discount_val,
          discount_perc,
          min_order_val,
          desc,
          stock,
          is_active
      });
      return freeship;
  } catch (error) {
      throw new Error(`Failed to update freeship: ${error.message}`);
  }
};

// Hàm xóa freeship
const deleteFreeship = async (freeshipId) => {
  try {
      const freeship = await Freeship.findByPk(freeshipId);
      if (!freeship) {
          throw new Error(`Freeship with ID ${freeshipId} not found`);
      }
      await freeship.destroy();
      return { message: `Freeship with ID ${freeshipId} deleted successfully` };
  } catch (error) {
      throw new Error(`Failed to delete freeship: ${error.message}`);
  }
};



module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscountByCode,
  updateDiscount,
  deleteDiscount,
  createFreeship,
  getAllFreeships,
  getFreeshipByCode,
  updateFreeship,
  deleteFreeship,
};
