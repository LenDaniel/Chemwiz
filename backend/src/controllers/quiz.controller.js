const asyncHandler = require("../utils/asyncHandler");

const placeholder = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "ChemWiz quiz controller is ready for implementation",
  });
});

module.exports = {
  placeholder,
};
