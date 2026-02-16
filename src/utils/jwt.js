const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config');

function signAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: '15m' });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: '7d' });
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwtConfig.refreshSecret);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
