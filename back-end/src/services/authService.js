import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Token from '../models/token.js';
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

// Login
export const loginUser = async ({email, password}) => {
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    
    if (!user.is_active) {
      throw new Error("User not active");
    }

    // Find and update old tokens
    await Token.update(
      { revoked: true, expired: true },
      { 
        where: { 
          userId: user.id 
        } 
      }
    );

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET,  
      { expiresIn: '8h' }  
    );

    // Save the token in the Token model
    await Token.create({
      token,
      revoked: false,
      expired: false,
      userId: user.id  
    });

    return { message: "Login successful", token, user };
  } catch (err) {
    throw new Error("Error logging in: " + err.message);
  }
}