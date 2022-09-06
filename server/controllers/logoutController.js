const { Users } = require("../models");
const jwt = require("jsonwebtoken");

const handleLogout = (req, res) => {
  //On client, also delete the accesToken

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // No content

  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  //Is refreshToken in DB?
  const foundUser = Users.findOne({ where: { refreshToken: refreshToken } });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(204);
  } else {
    // Delete refreshToken in DB
    res.clearCookie("jwt", { httpOnly: true });
    res.sendStatus(204);
  }
};

module.exports = { handleLogout };
