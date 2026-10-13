const { hasActiveSubscription } = require("../middleware/access.middleware");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, dataMode } = require("../data/modelProvider");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

const formatUser = (user) => {
  const expiry = user.subscriptionExpiresAt || null;
  const isExpired =
    expiry && new Date(expiry).getTime() < Date.now();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    level: user.level,
    subscriptionTier: user.subscriptionTier || "free",
    subscriptionStatus: isExpired ? "expired" : user.subscriptionStatus || "active",
    subscriptionExpiresAt: expiry,
    trialStartedAt: user.trialStartedAt || null,
    accountStatus: user.accountStatus || "active",
    access: {
      isPremium: hasActiveSubscription(user),
      isExpired: Boolean(isExpired),
      canUseTutor: hasActiveSubscription(user),
      canUseStructured: hasActiveSubscription(user),
      canUseWorkedExamples: hasActiveSubscription(user),
    },
  };
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure the unique email index exists before accepting concurrent signups.
    if (dataMode === 'mongodb') await User.init();

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    console.error("Register error:", error);
    res.status(500).json({
      message: "Server error while creating account.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

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

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error while logging in.",
    });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({
    user: formatUser(req.user),
  });
});

module.exports = router;
