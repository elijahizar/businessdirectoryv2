const { Users } = require("../models");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const foundUser = await Users.findOne({
    where: { refreshToken: refreshToken },
  });
  if (!foundUser) {
    return res.sendStatus(403);
  } else {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        console.log("Decoded user" + "%", decoded);
        if (err || foundUser.username !== decoded.username)
          return res.sendStatus(403);
        const roles = foundUser.roles;
        const accessToken = jwt.sign(
          { "UserInfo": { "username": foundUser.username, "roles": roles } },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "300s" }
        );
        res.json({ accessToken });
      }
    );
  }
};

module.exports = { handleRefreshToken };
