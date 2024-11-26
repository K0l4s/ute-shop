const db = require("../models");
const User = db.User;

// Lấy người dùng theo ID
const getUserById = async (id) => {
  return await User.findByPk(id);
};

// Cập nhật thông tin người dùng theo ID
const updateUserById = async (id, { firstname, lastname, address, birthday, gender, avatar_url, phone }) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedFields = {
    firstname,
    lastname,
    address,
    birthday,
    gender,
    phone,
  };

  if (avatar_url !== null) {
    updatedFields.avatar_url = avatar_url;
  }

  await user.update(updatedFields);

  return {
    firstname: user.firstname,
    lastname: user.lastname,
    birthday: user.birthday,
    gender: user.gender,
    avatar_url: user.avatar_url,
    phone: user.phone,
  };
};

const updateUserLocationById = async (id, { province, district, ward, address }) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error("User not found");
  }

  await user.update({ province, district, ward, address });

  return {
    province: user.province,
    district: user.district,
    ward: user.ward,
    address: user.address,
  }
};

const getAllUser = async () => {
  // Lấy tất cả người dùng với tổng đơn và số tiền họ đã mua
  return await User.findAll({
    attributes: {
      include: [
        [
          db.sequelize.literal(`(
            SELECT COUNT(*)
            FROM Orders
            WHERE Orders.user_id = User.id
          )`),
          "total_orders",
        ],
        [
          db.sequelize.literal(`(
            SELECT SUM(total_price)
            FROM Orders
            WHERE Orders.user_id = User.id
          )`),
          "total_spent",
        ],
      ],
    },
  });
};

const getAdminUsers = async () => {
  try {
    const admins = await db.User.findAll({
      where: { role: 'admin' }
    });
    return admins;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getUserById,
  updateUserById,
  updateUserLocationById,
  getAllUser,
  getAdminUsers
};
