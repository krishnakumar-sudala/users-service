const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config');

function signAccessToken(payload) {
  return jwt.sign(payload, jwt.secret, { expiresIn: '15m' });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, jwt.refreshSecret, { expiresIn: '7d' });
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwt.secret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwt.refreshSecret);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
