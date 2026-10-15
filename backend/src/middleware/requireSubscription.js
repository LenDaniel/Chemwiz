const requireSubscription = (req, res, next) => {
  // Subscription protection will be built in Phase L5/L6.
  next();
};

module.exports = requireSubscription;
