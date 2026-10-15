const hasActiveSubscription = (user) => {
  if (!user) return false;

  const tier = user.subscriptionTier || "free";
  const status = user.subscriptionStatus || "active";
  const expiry = user.subscriptionExpiresAt;

  const privilegedRoles = ["teacher", "admin"];
  const premiumTiers = ["premium", "teacher", "admin"];
  const activeStatuses = ["active", "trial"];

  if (privilegedRoles.includes(user.role)) return true;

  if (!premiumTiers.includes(tier)) return false;

  if (!activeStatuses.includes(status)) return false;

  if (expiry && new Date(expiry).getTime() < Date.now()) {
    return false;
  }

  return true;
};

const requirePremium = (req, res, next) => {
  if (!hasActiveSubscription(req.user)) {
    return res.status(403).json({
      success: false,
      code: "PREMIUM_REQUIRED",
      message: "Premium access is required for this feature.",
    });
  }

  next();
};

module.exports = {
  hasActiveSubscription,
  requirePremium,
};