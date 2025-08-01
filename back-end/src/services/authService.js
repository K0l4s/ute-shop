const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Token = db.Token;
const User = db.User;
const Wallet = db.Wallet;
const { sendEmail, generateVerificationCode } = require('./emailService.js');

// Register a new user
const registerUser = async ({ firstname, lastname, address, birthday, phone, email, password, repeat_psswd }) => {
  if (password !== repeat_psswd) {
    throw new Error("Passwords do not match");
  }
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = await generateVerificationCode();

    const newUser = await User.create({
      firstname,
      lastname,
      address,
      birthday,
      avatar_url: null,
      phone,
      email,
      password: hashedPassword,
      is_active: false,
      code: verificationCode,
      createAt: new Date(),
      updateAt: new Date()
    });

    const emailSubject = "Email verification";
    const emailText = `Your verification code is: ${verificationCode}`;
    await sendEmail(email, emailSubject, emailText);

    return { message: "User registered successfully" };
  } catch (err) {
    throw new Error("Error registering user: " + err);
  }
};

// Login
const loginUser = async ({ email, password, res }) => {
  try {
    const user = await User.findOne({ where: { email }, logging: console.log });
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

    await Token.update(
      { revoked: true, expired: true },
      { where: { userId: user.id }, logging: console.log }
    );

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    await Token.create({
      token,
      revoked: false,
      expired: false,
      userId: user.id,
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      maxAge: 8 * 60 * 60 * 1000,
      sameSite: 'None' // allow cookies to enable cross-site usage (virtual domain)
    });

    const returnData = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      province: user.province,
      district: user.district,
      ward: user.ward,
      address: user.address,
      birthday: user.birthday,
      gender: user.gender,
      avatar_url: user.avatar_url,
      phone: user.phone,
      email: user.email,
      role: user.role
    };
    return { message: "Login successful", data: returnData };
  } catch (err) {
    throw new Error("Error logging in: " + err.message);
  }
};

// Confirm register
const confirmRegister = async ({ email, code }) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }
    if (user.is_active) {
      throw new Error("User already active");
    }
    if (user.code != code) {
      throw new Error("Invalid code");
    }

    await User.update(
      { is_active: true, code: null },
      { where: { email } }
    );

    await Wallet.create({
      userId: user.id,
      coins: 0,
    })

    return { message: "Verification successfully" };
  } catch (err) {
    throw new Error("Error confirming user: " + err.message);
  }
};

// Forgot Password by sending verification code
const forgotPassword = async ({ email }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const verificationCode = await generateVerificationCode();

    await User.update(
      { code: verificationCode },
      { where: { email } }
    );

    const emailSubject = "Reset password";
    const emailText = `Your verification code is: ${verificationCode}`;
    await sendEmail(email, emailSubject, emailText);

    return { message: "Verification code sent" };
  } catch (err) {
    throw new Error("Error sending verification code: " + err.message);
  }
};

// Reset password
const resetPassword = async ({ email, code, password }) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }
    if (!user.code) {
      throw new Error("No code sent");
    }
    if (!user.is_active) {
      throw new Error("Active this account first");
    }
    if (user.code != code) {
      throw new Error("Invalid code");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update(
      { password: hashedPassword, code: null },
      { where: { email } }
    );

    return { message: "Password reset successfully" };
  } catch (err) {
    throw new Error("Error resetting password: " + err.message);
  }
};

const changePassword = async ({ userId, oldPassword, newPassword }) => {
  try {
    console.log(oldPassword, newPassword);
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );

    return { message: "Password changed successfully" };
  } catch (err) {
    throw new Error("Error changing password: " + err.message);
  }
};

const googleAuthCallback = async (user, res) => {
  try {
    // Revoke existing tokens
    await Token.update(
      { revoked: true, expired: true },
      { where: { userId: user.id } }
    );

    // Create new JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Save token to database
    await Token.create({
      token,
      revoked: false,
      expired: false,
      userId: user.id,
      role: user.role,
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      maxAge: 8 * 60 * 60 * 1000,
      sameSite: 'None'
    });

    const returnData = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      province: user.province,
      district: user.district,
      ward: user.ward,
      address: user.address,
      birthday: user.birthday,
      gender: user.gender,
      avatar_url: user.avatar_url,
      phone: user.phone,
      email: user.email,
      role: user.role,
      google_id: user.google_id
    };
    console.log("Google login successful", returnData);
    return { message: "Google login successful", data: returnData };
  } catch (err) {
    throw new Error("Error processing Google login: " + err.message);
  }
};

// Link existing account with Google
const linkGoogleAccount = async (userId, googleProfile) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if Google account is already linked to another user
    const existingGoogleUser = await User.findOne({
      where: { google_id: googleProfile.id }
    });

    if (existingGoogleUser && existingGoogleUser.id !== userId) {
      throw new Error("This Google account is already linked to another user");
    }

    // Update user with Google ID
    await user.update({
      google_id: googleProfile.id,
      avatar_url: googleProfile.photos[0]?.value || user.avatar_url
    });

    return { message: "Google account linked successfully" };
  } catch (err) {
    throw new Error("Error linking Google account: " + err.message);
  }
};

// Unlink Google account
const unlinkGoogleAccount = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.google_id) {
      throw new Error("No Google account linked");
    }

    if (!user.password) {
      throw new Error("Cannot unlink Google account. Please set a password first");
    }

    await user.update({ google_id: null });
    return { message: "Google account unlinked successfully" };
  } catch (err) {
    throw new Error("Error unlinking Google account: " + err.message);
  }
};


module.exports = {
  registerUser,
  loginUser,
  confirmRegister,
  forgotPassword,
  resetPassword,
  changePassword,
  googleAuthCallback,
  linkGoogleAccount,
  unlinkGoogleAccount
};
