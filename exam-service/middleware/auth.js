const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANT: normalize user id
    req.user = {
      id: decoded.id || decoded._id,
    };

    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
