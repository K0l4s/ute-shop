import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const register = async (req, res) => {
  const {username, password} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({username, password: hashedPassword});

    res.status(201).json({message: "User registered successfully", user: newUser});
  }
  catch (err) {
    res.status(500).json({err: "Error registering user"});
  }
};

export const login = async (req, res) => {
  const {username, password} = req.body;

  try {
    const user = await User.findOne({where: {username}}); 

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({err: "Invalid username or password"});
    }

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.json({message: "Login successful", token});
  }
  catch (err) {
    res.status(500).json({err: "Error logging in"});
  }
};

