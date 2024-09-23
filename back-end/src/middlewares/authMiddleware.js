import jwt from 'jsonwebtoken';

export const authenticateJWT = async (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie

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