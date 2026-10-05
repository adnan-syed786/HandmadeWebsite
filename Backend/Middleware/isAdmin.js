const User = require("../Models/User");

async function isAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = isAdmin;
