const { getUser } = require("../services/auth");

function checkUserLogin(req, res, next) {
  try {
    const userToken = req.cookies?.uid;
    if (!userToken) {
      return res.status(401).json({ message: "token not found", success: false });
    }

    const user = getUser(userToken);
    if (!user) {
      return res.status(401).json({ message: "invalid token", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message, success: false });
  }
}

module.exports = { checkUserLogin };