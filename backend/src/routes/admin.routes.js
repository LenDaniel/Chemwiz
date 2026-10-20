const express = require("express");
const { User, AdminLog } = require("../data/modelProvider");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

const router = express.Router();
const records = require('../services/adminRecords.service');
const { rateLimit } = require('express-rate-limit');
const recordWriteLimit = rateLimit({windowMs:60000,limit:60,keyGenerator:req=>String(req.user._id),standardHeaders:'draft-8',legacyHeaders:false,message:{code:'ADMIN_WRITE_LIMIT',message:'Please wait before making more record changes.'}});
const recordRoute = fn => async(req,res,next)=>{try{res.json(await fn(req));}catch(error){next(error);}};

router.use(protect);
router.use(adminOnly);

router.post('/users/:userId/trash', recordWriteLimit, recordRoute(req=>records.mutate('trash-account',req.params.userId,req.user,req.body)));
router.get('/recycle-bin', recordRoute(req=>records.recycleBin(req.query)));
router.post('/recycle-bin/:entryId/restore', recordWriteLimit, recordRoute(req=>records.entryAction('restore',req.params.entryId,req.user,req.body)));
router.delete('/recycle-bin/:entryId', recordWriteLimit, recordRoute(req=>records.entryAction('purge',req.params.entryId,req.user,req.body)));
router.get('/content-inventory', recordRoute(req=>records.sourceInventory(req.query)));
router.get('/content', recordRoute(req=>records.drafts(req.query)));
router.post('/content', recordWriteLimit, recordRoute(req=>records.mutate('save-content',require('../services/governanceStore').id(),req.user,{...req.body,revision:0})));
router.put('/content/:id', recordWriteLimit, recordRoute(req=>records.mutate('update-content',req.params.id,req.user,req.body)));
router.delete('/content/:id', recordWriteLimit, recordRoute(req=>records.mutate('trash-content',req.params.id,req.user,req.body)));


const formatAdminUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  level: user.level,
  subscriptionTier: user.subscriptionTier || "free",
  subscriptionStatus: user.subscriptionStatus || "active",
  subscriptionExpiresAt: user.subscriptionExpiresAt || null,
  accountStatus: user.accountStatus || "active",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const createAdminLog = async ({ adminId, targetUserId, action, details }) => {
  try {
    await AdminLog.create({
      admin: adminId,
      targetUser: targetUserId || null,
      action,
      details: details || {},
    });
  } catch (error) {
    console.error("Admin log error:", error.message);
  }
};

router.get("/test", async (req, res) => {
  res.json({
    success: true,
    message: "Admin route is working.",
    admin: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

router.get("/stats", async (req, res) => {
  try {
    const [
      totalUsers,
      students,
      teachers,
      admins,
      freeUsers,
      premiumUsers,
      activeUsers,
      expiredUsers,
      suspendedUsers,
    ] = await Promise.all([
      User.countDocuments({ recycleBin: null }),
      User.countDocuments({ recycleBin: null, role: "student" }),
      User.countDocuments({ recycleBin: null, role: "teacher" }),
      User.countDocuments({ recycleBin: null, role: "admin" }),
      User.countDocuments({ recycleBin: null, subscriptionTier: "free" }),
      User.countDocuments({ recycleBin: null, subscriptionTier: "premium" }),
      User.countDocuments({ recycleBin: null, subscriptionStatus: "active" }),
      User.countDocuments({ recycleBin: null, subscriptionStatus: "expired" }),
      User.countDocuments({ recycleBin: null, accountStatus: "suspended" }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        students,
        teachers,
        admins,
        freeUsers,
        premiumUsers,
        activeUsers,
        expiredUsers,
        suspendedUsers,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while loading admin stats.",
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const {
      search = "",
      role,
      subscriptionTier,
      subscriptionStatus,
      accountStatus,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { recycleBin: null };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) filter.role = role;
    if (subscriptionTier) filter.subscriptionTier = subscriptionTier;
    if (subscriptionStatus) filter.subscriptionStatus = subscriptionStatus;
    if (accountStatus) filter.accountStatus = accountStatus;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      users: users.map(formatAdminUser),
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while loading users.",
    });
  }
});

router.patch("/users/:id/subscription", async (req, res) => {
  try {
    const { subscriptionTier, subscriptionStatus, subscriptionExpiresAt } = req.body;

    const allowedTiers = ["free", "premium", "teacher", "admin"];
    const allowedStatuses = ["active", "trial", "expired", "cancelled"];

    const update = {};

    if (subscriptionTier !== undefined) {
      if (!allowedTiers.includes(subscriptionTier)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subscription tier.",
        });
      }

      update.subscriptionTier = subscriptionTier;
    }

    if (subscriptionStatus !== undefined) {
      if (!allowedStatuses.includes(subscriptionStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subscription status.",
        });
      }

      update.subscriptionStatus = subscriptionStatus;
    }

    if (subscriptionExpiresAt !== undefined) {
      update.subscriptionExpiresAt = subscriptionExpiresAt
        ? new Date(subscriptionExpiresAt)
        : null;
    }

const beforeUser = await User.findById(req.params.id).select("-password");

if (!beforeUser || beforeUser.recycleBin) {
  return res.status(404).json({
    success: false,
    message: "User not found.",
  });
}

const user = await User.findOneAndUpdate({_id:req.params.id,recycleBin:null}, {$set:update}, {
  new: true,
  runValidators: true,
}).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await createAdminLog({
  adminId: req.user._id,
  targetUserId: user._id,
  action: "UPDATE_SUBSCRIPTION",
  details: {
    targetEmail: user.email,
    before: {
      subscriptionTier: beforeUser.subscriptionTier,
      subscriptionStatus: beforeUser.subscriptionStatus,
      subscriptionExpiresAt: beforeUser.subscriptionExpiresAt,
    },
    after: {
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
    },
  },
});

    res.json({
      success: true,
      message: "Subscription updated successfully.",
      user: formatAdminUser(user),
    });
  } catch (error) {
    console.error("Admin subscription update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating subscription.",
    });
  }
});

router.patch("/users/:id/status", async (req, res) => {
  try {
    const { accountStatus } = req.body;

    if (String(req.params.id) === String(req.user._id) && accountStatus !== "active") {
  return res.status(400).json({
    success: false,
    message: "You cannot suspend or disable your own admin account.",
  });
}

    const allowedStatuses = ["active", "suspended", "disabled"];

    if (!allowedStatuses.includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account status.",
      });
    }

const beforeUser = await User.findById(req.params.id).select("-password");

if (!beforeUser || beforeUser.recycleBin) {
  return res.status(404).json({
    success: false,
    message: "User not found.",
  });
}

const user = await User.findOneAndUpdate(
  {_id:req.params.id,recycleBin:null},
  {$set:{accountStatus}},
  {
    new: true,
    runValidators: true,
  }
).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await createAdminLog({
  adminId: req.user._id,
  targetUserId: user._id,
  action: "UPDATE_ACCOUNT_STATUS",
  details: {
    targetEmail: user.email,
    before: {
      accountStatus: beforeUser.accountStatus,
    },
    after: {
      accountStatus: user.accountStatus,
    },
  },
});

    res.json({
      success: true,
      message: "Account status updated successfully.",
      user: formatAdminUser(user),
    });
  } catch (error) {
    console.error("Admin account status update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating account status.",
    });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate("admin", "name email role")
      .populate("targetUser", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Admin logs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while loading admin logs.",
    });
  }
});

router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["student", "teacher", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    const targetUser = await User.findById(req.params.id).select("-password");

    if (!targetUser || targetUser.recycleBin) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isSelf = String(req.params.id) === String(req.user._id);

    if (isSelf && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own admin role.",
      });
    }

    if (targetUser.role === "admin" && role !== "admin") {
      const adminCount = await User.countDocuments({ recycleBin: null, role: "admin" });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot remove the last admin account.",
        });
      }
    }

    const beforeRole = targetUser.role;

    const changedUser = await User.findOneAndUpdate({_id:targetUser._id,recycleBin:null},{$set:{role}},{new:true,runValidators:true});
    if (!changedUser) return res.status(409).json({message:'Account changed. Refresh before editing.'});
    targetUser.role = changedUser.role;

    await createAdminLog({
      adminId: req.user._id,
      targetUserId: targetUser._id,
      action: "UPDATE_USER_ROLE",
      details: {
        targetEmail: targetUser.email,
        before: {
          role: beforeRole,
        },
        after: {
          role: targetUser.role,
        },
      },
    });

    res.json({
      success: true,
      message: "User role updated successfully.",
      user: formatAdminUser(targetUser),
    });
  } catch (error) {
    console.error("Admin role update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user role.",
    });
  }
});

module.exports = router;