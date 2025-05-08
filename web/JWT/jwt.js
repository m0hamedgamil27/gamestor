const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

async function generateToken(user) {
  const payload = {
    id: user.id,
    role: user.role,
    username: user.username,
  };
  
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
}

function authenticateToken(req, res, next) {
  console.log("test")
  const token = req.cookies.auth; // ✅ Get token from cookie

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log(req.user)
    req.user = user; // decoded payload (must include user.id)
    next();
  });
}

module.exports = {
  generateToken,
  authenticateToken,
};
