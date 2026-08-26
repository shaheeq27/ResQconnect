const pool = require("../config/database");

const chatMiddleware = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    // User ID comes from JWT
    const userId = req.user.id;

    const query = `
            SELECT
                id,
                requester_id,
                assigned_provider_id,
                status
            FROM help_requests
            WHERE id = $1;
        `;

    const result = await pool.query(query, [requestId]);

    // Request doesn't exist
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Help request not found",
      });
    }

    const request = result.rows[0];

    // Check whether user is requester
    const isRequester = request.requester_id === userId;

    // Check whether user is assigned provider
    const isAssignedProvider = request.assigned_provider_id === userId;

    if (!isRequester && !isAssignedProvider) {
      return res.status(403).json({
        message: "Access denied. You are not part of this help request.",
      });
    }

    // Store request information for later use
    req.helpRequest = request;

    next();
  } catch (error) {
    console.error("Chat authorization error:", error);

    res.status(500).json({
      message: "Chat authorization failed",
    });
  }
};

module.exports = chatMiddleware;
