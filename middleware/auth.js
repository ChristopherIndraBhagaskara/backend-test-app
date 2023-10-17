const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Replace with your actual secret key
    req.user = decoded; // Attach user information to the request object
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
};
