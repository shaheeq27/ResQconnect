const pool = require("../config/database");
const { createNotification } = require("../models/notificationModel");

const getPendingRequests = async (req, res) => {
  try {
    const query = `
            SELECT help_requests.*, users.name AS requester_name, users.phone AS requester_phone
            FROM help_requests
            JOIN users ON users.id = help_requests.requester_id
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

const getEmergencyRequests = async (req, res) => {
  try {
    const query = `
            SELECT help_requests.*, users.name AS requester_name, users.phone AS requester_phone
            FROM help_requests
            JOIN users ON users.id = help_requests.requester_id
            WHERE request_type = 'emergency'
            ORDER BY created_at DESC;
        `;

    const result = await pool.query(query);

    res.status(200).json({
      requests: result.rows,
    });
  } catch (error) {
    console.error("Get emergency requests error:", error);

    res.status(500).json({
      message: "Failed to fetch emergency requests",
    });
  }
};

const getNonEmergencyRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        help_requests.*,
        requester.name AS requester_name,
        requester.phone AS requester_phone,
        provider.name AS provider_name,
        provider.phone AS provider_phone
      FROM help_requests
      JOIN users requester ON requester.id = help_requests.requester_id
      LEFT JOIN users provider ON provider.id = help_requests.assigned_provider_id
      WHERE help_requests.request_type = 'non_emergency'
      ORDER BY help_requests.created_at DESC;
    `);

    res.status(200).json({ requests: result.rows });
  } catch (error) {
    console.error("Get non-emergency requests error:", error);
    res.status(500).json({ message: "Failed to fetch non-emergency requests" });
  }
};

const getActiveRequests = async (req, res) => {
  try {
    const query = `
            SELECT
                help_requests.*,
                requester.name AS requester_name,
                requester.phone AS requester_phone,
                provider.name AS provider_name,
                provider.phone AS provider_phone
            FROM help_requests
            JOIN users requester ON requester.id = help_requests.requester_id
            LEFT JOIN users provider ON provider.id = help_requests.assigned_provider_id
            WHERE help_requests.request_type = 'emergency'
              AND help_requests.status IN ('assigned', 'accepted', 'in_progress')
            ORDER BY help_requests.updated_at DESC;
        `;

    const result = await pool.query(query);

    res.status(200).json({
      requests: result.rows,
    });
  } catch (error) {
    console.error("Get active requests error:", error);

    res.status(500).json({
      message: "Failed to fetch active requests",
    });
  }
};

const getCompletedRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        help_requests.*,
        requester.name AS requester_name,
        requester.phone AS requester_phone,
        provider.name AS provider_name,
        provider.phone AS provider_phone
      FROM help_requests
      JOIN users requester ON requester.id = help_requests.requester_id
      LEFT JOIN users provider ON provider.id = help_requests.assigned_provider_id
      WHERE help_requests.request_type = 'emergency'
        AND help_requests.status = 'completed'
      ORDER BY help_requests.updated_at DESC;
    `);

    res.status(200).json({ requests: result.rows });
  } catch (error) {
    console.error("Get completed requests error:", error);
    res.status(500).json({ message: "Failed to fetch completed requests" });
  }
};

const getEmergencyRequestById = async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
          help_requests.*,
          requester.name AS requester_name,
          requester.phone AS requester_phone,
          requester.email AS requester_email,
          provider.name AS provider_name,
          provider.phone AS provider_phone
        FROM help_requests
        JOIN users requester ON requester.id = help_requests.requester_id
        LEFT JOIN users provider ON provider.id = help_requests.assigned_provider_id
        WHERE help_requests.id = $1 AND help_requests.request_type = 'emergency'
      `,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Emergency request not found" });
    }

    res.status(200).json({ request: result.rows[0] });
  } catch (error) {
    console.error("Get manager emergency request error:", error);
    res.status(500).json({ message: "Failed to fetch emergency request" });
  }
};

const getProviderByIdOrName = async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT id, name, email, phone, address, availability_status, verification_status, created_at
        FROM users
        WHERE role = 'provider' AND (id::text = $1 OR name = $1)
        LIMIT 1
      `,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({ provider: result.rows[0] });
  } catch (error) {
    console.error("Get manager provider error:", error);
    res.status(500).json({ message: "Failed to fetch provider" });
  }
};

const getProviders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        occupation,
        address,
        availability_status,
        verification_status,
        created_at
      FROM users
      WHERE role = 'provider'
      ORDER BY created_at DESC;
    `);

    res.status(200).json({ providers: result.rows });
  } catch (error) {
    console.error("Get providers error:", error);
    res.status(500).json({ message: "Failed to fetch providers" });
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

const completeRequest = async (req, res) => {
  try {
    const result = await pool.query(
      `
        UPDATE help_requests
        SET status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND request_type = 'emergency'
          AND status IN ('assigned', 'accepted', 'in_progress')
        RETURNING *;
      `,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(409).json({
        message: "Only active emergency requests can be completed.",
      });
    }

    const request = result.rows[0];
    await createNotification(
      request.requester_id,
      request.id,
      "request_completed",
      "Help Request Completed",
      "Your help request has been completed successfully.",
    );

    res.status(200).json({
      message: "Help request completed successfully",
      request,
    });
  } catch (error) {
    console.error("Manager complete request error:", error);
    res.status(500).json({ message: "Failed to complete help request" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending_verification' AND request_type = 'emergency') AS pending_count,
        COUNT(*) FILTER (WHERE status IN ('assigned', 'accepted', 'in_progress') AND request_type = 'emergency') AS active_count,
        COUNT(*) FILTER (WHERE status = 'approved' AND request_type = 'emergency') AS verified_count,
        COUNT(*) FILTER (WHERE status = 'completed' AND request_type = 'emergency') AS completed_count,
        COUNT(*) FILTER (WHERE request_type = 'emergency') AS total_count
      FROM help_requests
    `);

    const notifResult = await pool.query(
      `
      SELECT COUNT(*) AS unread_count
      FROM notifications
      WHERE user_id = $1 AND is_read = false
    `,
      [req.user.id],
    );

    const stats = result.rows[0];
    res.status(200).json({
      pending_count: parseInt(stats.pending_count) || 0,
      active_count: parseInt(stats.active_count) || 0,
      verified_count: parseInt(stats.verified_count) || 0,
      completed_count: parseInt(stats.completed_count) || 0,
      total_count: parseInt(stats.total_count) || 0,
      unread_notifications: parseInt(notifResult.rows[0].unread_count) || 0,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

module.exports = {
  getPendingRequests,
  getEmergencyRequests,
  getNonEmergencyRequests,
  getActiveRequests,
  getCompletedRequests,
  getEmergencyRequestById,
  getProviderByIdOrName,
  getProviders,
  approveRequest,
  rejectRequest,
  completeRequest,
  getDashboardStats,
};
