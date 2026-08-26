const pool = require("../config/database");

// Find user by email
const findUserByEmail = async (email) => {
  const query = `
        SELECT *
        FROM users
        WHERE email = $1;
    `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

// Find user by ID
const findUserById = async (id) => {
  const query = `
        SELECT
            id,
            name,
            email,
            phone,
            occupation,
            blood_group,
            latitude,
            longitude,
            address,
            role,
            availability_status,
            verification_status,
            created_at
        FROM users
        WHERE id = $1;
    `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

// Create a new user
const createUser = async (userData) => {
  const {
    name,
    email,
    phone,
    password_hash,
    occupation,
    blood_group,
    latitude,
    longitude,
    address,
    role,
  } = userData;

  const query = `
        INSERT INTO users (
            name,
            email,
            phone,
            password_hash,
            occupation,
            blood_group,
            latitude,
            longitude,
            address,
            role
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING
            id,
            name,
            email,
            phone,
            occupation,
            blood_group,
            latitude,
            longitude,
            address,
            role,
            availability_status,
            verification_status,
            created_at;
    `;

  const values = [
    name,
    email,
    phone,
    password_hash,
    occupation,
    blood_group,
    latitude,
    longitude,
    address,
    role || "seeker",
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
