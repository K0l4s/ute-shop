const jwt = require('jsonwebtoken');

const authenticateJWT = async (req, res, next) => {
  // Lấy token từ cookie hoặc từ header Authorization
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = {
  authenticateJWT
};
