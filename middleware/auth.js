
const User = require("../modals/user");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(403).json({ success: false, error: "Unauthorized" });
      }
    // console.log(token);
   const decoded = jwt.verify(token, "secretKey");
    const userId = decoded.userId;
    // console.log('userId>>>>>>' ,userId);
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ success: false, error: "Unauthorized file-auth " });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error:", err);
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
};

module.exports = { authenticate };