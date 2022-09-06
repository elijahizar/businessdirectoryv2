const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log("Auth header", authHeader);
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Data received from user 1: ", decoded);

    req.roles = decoded.UserInfo.roles;
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403); //  invalid Token

    /*  res.clearCookie("token");
    return res.redirect("/"); */
  }
};
