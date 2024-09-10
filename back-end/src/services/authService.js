import bcrypt from 'bcryptjs';
import User from '../models/user.js';

// Register a new user
export const registerUser = async ({ fullname, address, birthday, avatar_url, phone, email, password, is_active, role }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullname,
      address,
      birthday,
      avatar_url,
      phone,
      email,
      password: hashedPassword,
      is_active,
      role
    });
    return { message: "User registered successfully", user: newUser };
  } catch (err) {
    throw new Error("Error registering user" + err);
  }
};
