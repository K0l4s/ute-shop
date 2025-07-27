const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const authenticateJWT = async (req, res, next) => {
  // Lấy token từ cookie hoặc từ header Authorization
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.sendStatus(403);
      }
      
      req.user = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        email: user.email,
        province: user.province,
        district: user.district,
        ward: user.ward,
        address: user.address,
        gender: user.gender,
        birthday: user.birthday,
        avatar_url: user.avatar_url,
        role: user.role
      };
      
      next();
    } catch (err) {
      console.error('JWT verification error:', err);
      return res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  authenticateJWT
};
