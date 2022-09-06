const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

router
  .route("/:id")
  .post(commentsController.createComment)
  .get(commentsController.getCommentsByPost);

module.exports = router;
