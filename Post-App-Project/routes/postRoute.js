const express = require("express");
const router = express.Router();
const postController = require("../controllers/postRouteController");

//const isAuth = require("../middleware/is-auth");

const {ensureAuthenticated}=require('../config/auth')


router.post("/addpost", ensureAuthenticated, postController.addNewPost);

router.get("/getallPost", ensureAuthenticated,postController.getUserPost);

router.get("/allUserPost",ensureAuthenticated, postController.getAllUserPost);

router.get("/postById",ensureAuthenticated, postController.getPostById);

router.get("/deletePostUser",ensureAuthenticated, postController.deletePostUser);

router.post("/addYourComments",ensureAuthenticated, postController.addYourComments);

router.get("/seeAllComments",ensureAuthenticated,postController.seeAllComments);

router.get("/findAllComment", ensureAuthenticated ,postController.findAllComment);
                                                                                                                                                                                                                
router.get("/deleteComments",  postController.deleteComments);

router.post("/updatePostByUser", postController.updatePostByUser);

router.get("/editComments",postController.editComments)

router.post("/updateComment",postController.updateComment)

router.get("/editPostUser",ensureAuthenticated,postController.editPostUser)

module.exports = router;

