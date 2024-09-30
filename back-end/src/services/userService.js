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
    address: user.address,
    birthday: user.birthday,
    gender: user.gender,
    avatar_url: user.avatar_url,
    phone: user.phone,
  };
};

module.exports = {
  getUserById,
  updateUserById
};
