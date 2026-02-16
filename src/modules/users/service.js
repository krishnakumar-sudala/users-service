const db = require('../../db/pool');
const bcrypt = require('bcrypt');


exports.getMe = async (userId) => {
  const result = await db.query(
    'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
};

exports.getAllUsers = async () => {
  const result = await db.query(
    'SELECT id, email, full_name, role, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

exports.updateUser = async (id, data) => {

  if (data.password) { 
    const saltRounds = 10; 
    data.password_hash = await bcrypt.hash(data.password, saltRounds); 
    delete data.password; 
  }

  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    fields.push(`${key} = $${index}`);
    values.push(data[key]);
    index++;
  }

  values.push(id);

  const result = await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, email, full_name, role`,
    values
  );

  return result.rows[0];
};

exports.deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
  return { message: 'User deleted' };
};
