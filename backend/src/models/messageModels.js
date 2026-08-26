const pool = require("../config/database");

// Send a message
const markMessagesAsRead = async (requestId, userId) => {
  const query = `
        UPDATE messages
        SET is_read = TRUE
        WHERE request_id = $1
          AND sender_id != $2
          AND is_read = FALSE
        RETURNING *;
    `;

  const result = await pool.query(query, [requestId, userId]);

  return result.rows;
};
const createMessage = async (requestId, senderId, message) => {
  const query = `
        INSERT INTO messages (
            request_id,
            sender_id,
            message
        )
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

  const result = await pool.query(query, [requestId, senderId, message]);

  return result.rows[0];
};

// Get all messages for a help request
const getMessagesByRequestId = async (requestId) => {
  const query = `
        SELECT
            m.id,
            m.request_id,
            m.sender_id,
            u.name AS sender_name,
            u.role AS sender_role,
            m.message,
            m.created_at
        FROM messages m
        JOIN users u
            ON m.sender_id = u.id
        WHERE m.request_id = $1
        ORDER BY m.created_at ASC;
    `;

  const result = await pool.query(query, [requestId]);

  return result.rows;
};
const getUnreadMessageCount = async (requestId, userId) => {
  const query = `
        SELECT COUNT(*) AS unread_count
        FROM messages
        WHERE request_id = $1
          AND sender_id != $2
          AND is_read = FALSE;
    `;

  const result = await pool.query(query, [requestId, userId]);

  return parseInt(result.rows[0].unread_count, 10);
};
module.exports = {
  createMessage,
  getMessagesByRequestId,
  markMessagesAsRead,
  getUnreadMessageCount,
};
