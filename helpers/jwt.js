const jwt = require('jsonwebtoken');

const loginToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET);
  return token;
}

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (error) {
    return null;    
  }
}

module.exports = {
  loginToken,
  verifyToken
}