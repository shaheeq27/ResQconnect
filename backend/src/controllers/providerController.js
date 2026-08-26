const {
  getApprovedRequests,
  getApprovedRequestById,
  acceptHelpRequest,
  startHelpRequest,
  completeHelpRequest,
} = require("../models/providerModels");
const { createNotification } = require("../models/notificationModel");

// Get approved requests
const getAvailableRequests = async (req, res) => {
  try {
    const requests = await getApprovedRequests();

    res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Get available requests error:", error);

    res.status(500).json({
      message: "Failed to fetch available requests",
    });
  }
};

// Get a specific request
const getRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await getApprovedRequestById(id);

    if (!request) {
      return res.status(404).json({
        message: "Help request not found",
      });
    }

    res.status(200).json({
      request,
    });
  } catch (error) {
    console.error("Get request details error:", error);

    res.status(500).json({
      message: "Failed to fetch request",
    });
  }
};

// Accept a request
const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Provider ID comes from JWT
    const providerId = req.user.id;
    const result = await acceptHelpRequest(id, providerId);
    await createNotification(
      result.request.requester_id,
      result.request.id,
      "request_accepted",
      "Provider Accepted Your Request",
      "A provider has accepted your help request.",
    );

    res.status(200).json({
      message: "Help request accepted successfully",
      request: result.request,
      provider: result.provider,
    });
  } catch (error) {
    console.error("Accept request error:", error);

    if (error.message === "Request is not available for acceptance") {
      return res.status(409).json({
        message: error.message,
      });
    }

    if (error.message === "Provider not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to accept request",
    });
  }
};
// Start helping the requester
const startRequest = async (req, res) => {
  try {
    const { id } = req.params;
    // Provider ID comes from JWT
    const providerId = req.user.id;

    const request = await startHelpRequest(id, providerId);

    if (!request) {
      return res.status(409).json({
        message:
          "Request cannot be started. It may not be assigned to you or is not in accepted status.",
      });
    }
    await createNotification(
      request.requester_id,
      request.id,
      "request_started",
      "Help Has Started",
      "The assigned provider has started helping you.",
    );

    res.status(200).json({
      message: "Help request started successfully",
      request,
    });
  } catch (error) {
    console.error("Start request error:", error);

    res.status(500).json({
      message: "Failed to start help request",
    });
  }
};
// Complete a help request
const completeRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Provider ID comes from JWT
    const providerId = req.user.id;
    const request = await completeHelpRequest(id, providerId);

    if (!request) {
      return res.status(409).json({
        message:
          "Request cannot be completed. It may not be assigned to you or is not in in_progress status.",
      });
    }

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
    console.error("Complete request error:", error);

    res.status(500).json({
      message: "Failed to complete help request",
    });
  }
};

module.exports = {
  getAvailableRequests,
  completeRequest,
  startRequest,
  getRequestDetails,
  acceptRequest,
};
