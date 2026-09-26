//const { Pool } = require("pg");

//const pool = new Pool({
//  user: process.env.DB_USER,
//host: process.env.DB_HOST,
//database: process.env.DB_NAME,
//password: process.env.DB_PASSWORD,
//port: process.env.DB_PORT
//});

//pool.on("connect", () => {
//  console.log("Connected to PostgreSQL");
//});
//pool.on("error", (err) => {
//  console.error("PostgreSQL error:", err);
//});

//module.exports = pool;
const { Pool, types } = require("pg");

// TIMESTAMP WITHOUT TIME ZONE from Neon/Postgres is UTC; parse as UTC in Node.
types.setTypeParser(1114, (value) => {
  if (value === null) return null;
  return new Date(`${String(value).replace(" ", "T")}Z`);
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("Connected to Neon PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

module.exports = pool;
