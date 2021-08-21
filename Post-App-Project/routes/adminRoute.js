const express = require("express");
const router = express.Router();
const adminControllers = require('../controllers/adminController');
const isAdmin =require("../middleware/is-admin");

const { ensureAuthenticated } = require("../config/auth");

router.get("/adminHome", adminControllers.userList);

router.get("/makeAdmin",ensureAuthenticated, adminControllers.makeAdmin);

router.get("/showAllPostToAdmin",ensureAuthenticated, adminControllers.showpostToAdmin);

router.get("/deletePost",ensureAuthenticated,adminControllers.deletePost)

router.post("/updatePostByAdmin",ensureAuthenticated,adminControllers.updatePostByAdmin)

router.get("/removeFromAdmin",ensureAuthenticated,adminControllers.removeFromAdmin)

router.get("/seeAllCommentsAdmin",ensureAuthenticated,adminControllers.seeAllCommentsAdmin)

router.get("/editPost",ensureAuthenticated,adminControllers.editPost)

module.exports=router;