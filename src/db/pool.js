const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  search_path: config.db.schema || process.env.PGSCHEMA   //this is to prefix the schema name before the table names like schema.table_name
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
