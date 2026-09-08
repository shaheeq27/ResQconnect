const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/managerController");

const authMiddleware = require("../middleware/authMiddleware");
const managerMiddleware = require("../middleware/managerMiddleware");

// Get pending emergency requests
router.get(
  "/requests/pending",
  authMiddleware,
  managerMiddleware,
  getPendingRequests,
);

router.get(
  "/requests/emergency",
  authMiddleware,
  managerMiddleware,
  getEmergencyRequests,
);

router.get(
  "/requests/non-emergency",
  authMiddleware,
  managerMiddleware,
  getNonEmergencyRequests,
);

router.get(
  "/requests/active",
  authMiddleware,
  managerMiddleware,
  getActiveRequests,
);

router.get(
  "/requests/completed",
  authMiddleware,
  managerMiddleware,
  getCompletedRequests,
);

router.get(
  "/requests/emergency/:id",
  authMiddleware,
  managerMiddleware,
  getEmergencyRequestById,
);

router.get(
  "/providers/:id",
  authMiddleware,
  managerMiddleware,
  getProviderByIdOrName,
);

router.get("/providers", authMiddleware, managerMiddleware, getProviders);

// Approve emergency request
router.put(
  "/requests/:id/approve",
  authMiddleware,
  managerMiddleware,
  approveRequest,
);

// Reject emergency request
router.put(
  "/requests/:id/reject",
  authMiddleware,
  managerMiddleware,
  rejectRequest,
);

router.put(
  "/requests/:id/complete",
  authMiddleware,
  managerMiddleware,
  completeRequest,
);

// Dashboard stats
router.get(
  "/dashboard/stats",
  authMiddleware,
  managerMiddleware,
  getDashboardStats,
);

module.exports = router;
