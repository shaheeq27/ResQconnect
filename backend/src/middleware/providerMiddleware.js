const providerMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Allow all authenticated users — HelpBridge supports dual-role (seeker can also be a provider)
    // Only block unauthenticated requests
    next();
  } catch (error) {
    console.error("Provider authorization error:", error);

    return res.status(500).json({
      message: "Authorization failed",
    });
  }
};

module.exports = providerMiddleware;
