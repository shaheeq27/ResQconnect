const pool = require("../config/database");
const { createNotification } = require("../models/notificationModel");

const getPendingRequests = async (req, res) => {
  try {
    const query = `
            SELECT *
            FROM help_requests
            WHERE status = 'pending_verification'
              AND request_type = 'emergency'
            ORDER BY created_at ASC;
        `;

    const result = await pool.query(query);

    res.status(200).json({
      requests: result.rows,
    });
  } catch (error) {
    console.error("Get pending requests error:", error);

    res.status(500).json({
      message: "Failed to fetch pending requests",
    });
  }
};

// Approve an emergency request
const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
            UPDATE help_requests
            SET status = 'approved',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
              AND status = 'pending_verification'
            RETURNING *;
        `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Pending request not found",
      });
    }

    await createNotification(
      result.rows[0].requester_id,
      result.rows[0].id,
      "request_approved",
      "Help Request Approved",
      `Your help request "${result.rows[0].title}" has been approved by the manager.`,
    );

    res.status(200).json({
      message: "Help request approved successfully",
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Approve request error:", error);

    res.status(500).json({
      message: "Failed to approve request",
    });
  }
};

// Reject an emergency request
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
            UPDATE help_requests
            SET status = 'rejected',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
              AND status = 'pending_verification'
            RETURNING *;
        `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Pending request not found",
      });
    }

    res.status(200).json({
      message: "Help request rejected successfully",
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Reject request error:", error);

    res.status(500).json({
      message: "Failed to reject request",
    });
  }
};

module.exports = {
  getPendingRequests,
  approveRequest,
  rejectRequest,
};
