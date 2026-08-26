const express = require("express");

const router = express.Router();

const {
  getPendingRequests,
  approveRequest,
  rejectRequest,
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

module.exports = router;
