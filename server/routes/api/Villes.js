const express = require("express");
const router = express.Router();

const villesController = require("../../controllers/villesController");

router.route("/").get(villesController.getAllVilles);

module.exports = router;
