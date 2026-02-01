module.exports = {
  db: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    schema: process.env.PGSCHEMA  //this is to switch between different schemas if needed
  }
};
