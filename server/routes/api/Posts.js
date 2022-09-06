const express = require("express");
const router = express.Router();
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");
const postsController = require("../../controllers/postsController");

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), postsController.getAllPosts)
  .post(verifyRoles(ROLES_LIST.Admin), postsController.createPost);

router.route("/:id").get(postsController.getOnePost);
router.route("/:id/delete").post(postsController.deletePost);
router.route("/:id/edit").post(postsController.editPost);
router.route("/category/:idcategory").get(postsController.getPostsByCategory);

module.exports = router;
