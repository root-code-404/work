const jwt = require('jsonwebtoken');

const cartMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('No token provided or invalid format');
    return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ message: 'Forbidden: Token verification failed' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = cartMiddleware;
