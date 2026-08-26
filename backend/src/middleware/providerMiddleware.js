const providerMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user.role !== "provider") {
      return res.status(403).json({
        message: "Access denied. Provider access required.",
      });
    }

    next();
  } catch (error) {
    console.error("Provider authorization error:", error);

    return res.status(500).json({
      message: "Authorization failed",
    });
  }
};

module.exports = providerMiddleware;
