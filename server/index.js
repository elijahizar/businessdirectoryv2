require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const cookieParser = require("cookie-parser");
const auth = require("./auth/auth");
const bodyParser = require("body-parser");
const session = require("express-session");
const fileUpload = require("express-fileupload");

const app = express();
app.use(fileUpload());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const sess = {
  key: "userId",
  secret: process.env.SESS_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24,
  },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

const db = require("./models");

// Routers
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use("/comments", require("./routes/Comments"));
app.use("/auth", require("./routes/Users"));
app.use("/villes", require("./routes/api/Villes"));
app.use("/categories", require("./routes/api/Categories"));

app.use(auth);
app.use("/posts", require("./routes/api/Posts"));

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001.");
  });
});
