const requireAdmin = (req, res, next) => {
  // Admin protection will be built in the admin phase.
  next();
};

module.exports = requireAdmin;
