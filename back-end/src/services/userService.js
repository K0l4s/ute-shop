import User from "../models/user.js";
export const getUserById = async (id) => {
  return await User.findByPk(id);
}

export const updateUserById = async (id, { firstname, lastname, address, birthday, gender, avatar_url, phone }) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error("User not found");
  }

  await user.update({
    firstname,
    lastname,
    address,
    birthday,
    gender,
    avatar_url,
    phone
  });

  return user;
}