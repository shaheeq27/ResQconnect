const express = require("express");

const router = express.Router();

const {
  getAvailableRequests,
  getRequestDetails,
  getMyRequests,
  acceptRequest,
  startRequest,
  completeRequest,
} = require("../controllers/providerController");

const authMiddleware = require("../middleware/authMiddleware");

const providerMiddleware = require("../middleware/providerMiddleware");

router.put(
  "/requests/:id/start",
  authMiddleware,
  providerMiddleware,
  startRequest,
);
// Get approved requests
router.get(
  "/requests/available",
  authMiddleware,
  providerMiddleware,
  getAvailableRequests,
);

router.get("/requests/mine", authMiddleware, providerMiddleware, getMyRequests);

// Get request details
router.get(
  "/requests/:id",
  authMiddleware,
  providerMiddleware,
  getRequestDetails,
);

// Accept request
router.put(
  "/requests/:id/accept",
  authMiddleware,
  providerMiddleware,
  acceptRequest,
);
router.put(
  "/requests/:id/complete",
  authMiddleware,
  providerMiddleware,
  completeRequest,
);

module.exports = router;
