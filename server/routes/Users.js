const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("../auth/auth");

router.get("/isAuth", auth, (req, res) => {
  res.send("User is authenticated.");
});

router.get("/", auth, async (req, res) => {
  const usersFound = await Users.findAll();
  if (!usersFound)
    return res.sendStatus(204).json({ "message": "No users found" });
  res.json(usersFound);
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("User created");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(401);

  const foundUser = await Users.findOne({ where: { username: username } });
  if (!foundUser) {
    const message = "User not found.";
    return res.status(401).json({ message });
  } else {
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const roles = foundUser.roles;
      // JWT
      const accessToken = jwt.sign(
        { "UserInfo": { "username": foundUser.username, "roles": roles } },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "300s",
        }
      );
      const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      try {
        result = await Users.update(
          { refreshToken: refreshToken },
          { where: { username: foundUser.username } }
        );

        console.log(result);
      } catch (err) {
        console.log(err);
      }
      // Create cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ roles, accessToken });
    } else {
      const message = "Incorrect password.  Please try again.";
      return res.status(401).json({ message });
    }
  }
});

module.exports = router;
