import jwt from 'jsonwebtoken';
import Token from '../models/token.js';

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the token is revoked or expired
      const tokenRecord = await Token.findOne({
        where: {
          token,
          revoked: false,
          expired: false
        }
      });

      if (!tokenRecord) {
        res.sendStatus(403); // Forbidden
      }

      req.user = decoded;
      next();
    }
    catch (err) {
      return res.sendStatus(403); //Forbidden
    }
  }
  else {
    res.sendStatus(401); // Unauthorized
  }
};