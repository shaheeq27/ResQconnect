const {
  createHelpRequest,
  getHelpRequestsByUser,
  getHelpRequestById,
} = require("../models/helpRequestModels");

// Create a new help request
const createRequest = async (req, res) => {
  try {
    const {
      request_type,
      emergency_type,
      title,
      description,
      latitude,
      longitude,
      address,
    } = req.body;

    // Basic validation
    if (
      !request_type ||
      !title ||
      latitude === undefined ||
      longitude === undefined ||
      !["emergency", "non_emergency"].includes(request_type) ||
      !Number.isFinite(Number(latitude)) ||
      Number(latitude) < -90 ||
      Number(latitude) > 90 ||
      !Number.isFinite(Number(longitude)) ||
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {
      return res.status(400).json({
        message: "Request type, title, latitude and longitude are required",
      });
    }

    // Get logged-in user's ID
    const requester_id = req.user.id;

    const request = await createHelpRequest({
      requester_id,
      request_type,
      emergency_type,
      title,
      description,
      latitude,
      longitude,
      address,
    });

    res.status(201).json({
      message: "Help request created successfully",
      request,
    });
  } catch (error) {
    console.error("Create help request error:", error);

    res.status(500).json({
      message: "Failed to create help request",
    });
  }
};

// Get all requests created by logged-in user
const getMyRequests = async (req, res) => {
  try {
    const requester_id = req.user.id;

    const requests = await getHelpRequestsByUser(requester_id);

    res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Get my requests error:", error);

    res.status(500).json({
      message: "Failed to fetch help requests",
    });
  }
};

const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await getHelpRequestById(id);

    if (!request) {
      return res.status(404).json({
        message: "Help request not found",
      });
    }

    res.status(200).json({
      request,
    });
  } catch (error) {
    console.error("Get help request error:", error);

    res.status(500).json({
      message: "Failed to fetch help request",
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getRequestById,
};
