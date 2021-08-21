const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isAuth = require("../middleware/is-auth");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const Role = require("../models/role");

router.get("/", userController.landing_page);

router.get("/login", userController.login_get);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    Role.findOne({ name: "admin" }).then((isAdmin) => {
      if (req.body.adminLogin && req.user.roles.includes(isAdmin._id)) {
        res.redirect("/adminHome");
      } else {
        res.render("dashboard",{req});
      }
    });
  }
);

router.post("/register", userController.register_post);
router.get("/register", userController.register_get);

router.get("/forget", userController.forget_get);
router.post("/forget", userController.forget_post);

router.get("/changePass", isAuth, userController.changePass_get);
router.post("/changePass", isAuth, userController.changePass_post);

router.get("/dashboard", ensureAuthenticated, userController.dashboard_get);

router.post("/logout", userController.logout_post);

module.exports = router;
