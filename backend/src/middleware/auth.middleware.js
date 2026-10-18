const jwt = require("jsonwebtoken");
const { User } = require("../data/modelProvider");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose && decoded.purpose !== 'access') return res.status(401).json({code:'AUTH_TOKEN_INVALID',message:'This token cannot open a workspace.'});

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. User not found.",
      });
    }
    if ((decoded.authVersion || 0) !== (user.authVersion || 0)) return res.status(401).json({code:'SESSION_REVOKED',message:'Your password changed. Please sign in again.'});
    if (!user.passwordPolicyVersion) return res.status(403).json({code:'PASSWORD_REAUTH_REQUIRED',message:'Please sign in again to check your password against the updated security requirements.'});

    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_SUSPENDED",
        message: "This account has been suspended. Contact ChemWiz support.",
      });
    }

    if (user.accountStatus === "disabled") {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_DISABLED",
        message: "This account has been disabled. Contact ChemWiz support.",
      });
    }

    if(user.role!=='admin'&&user.privacy?.guardianId&&!await require('../services/privacy.service').currentGuardian(user))user.privacy={...user.privacy,coreConsent:false,aiConsent:false,voiceConsent:false,guardianWithdrawn:true};
    if(user.role!=='admin')user.schoolEntitlement=await require('../services/schools.service').hasEntitlement(user);
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid or expired token.",
    });
  }
};

module.exports = { protect };
