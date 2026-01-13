const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '59283ddab4ac691dfa8be21b11d3fb9b2bbb80d8d1703da1a971dc78937bceed04dfe4ee651565eacaaf0cd5ca6365a54035fc2a18868d9da465159289cb1a1a';
const JWT_EXPIRES_IN = '24h';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
