const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "adnanisdmwad";

const fetchuser = (req, res, next) => {
  // JWT token se user nikalna aur req object me store karna
  const token = req.header('authToken');
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user; // user ka data req me attach kar diya
    next(); // ab next route/middleware ko control do
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
