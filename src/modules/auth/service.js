const bcrypt = require('bcrypt');
const db = require('../../db/pool');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt');

exports.signup = async ({ email, password }) => {
  const hash = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role',
    [email, hash]
  );
  return result.rows[0];
};

exports.login = async ({ email, password }) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error('Invalid credentials');
  }

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await db.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
    [user.id, refreshToken]
  );

  return { accessToken, refreshToken };
};

exports.refresh = async (token) => {
  const decoded = verifyRefreshToken(token);
  const result = await db.query(
    'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2',
    [token, decoded.sub]
  );
  if (!result.rows.length) throw new Error('Invalid refresh token');

  const payload = { sub: decoded.sub, email: decoded.email, role: decoded.role };
  const accessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);

  await db.query(
    'UPDATE refresh_tokens SET token = $1, expires_at = NOW() + INTERVAL \'7 days\' WHERE user_id = $2',
    [newRefreshToken, decoded.sub]
  );

  return { accessToken, refreshToken: newRefreshToken };
};
