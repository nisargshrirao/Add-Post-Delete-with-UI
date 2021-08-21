const bcrypt = require("bcryptjs");
const { serializeUser } = require("passport");
const mongoose = require("mongoose");
const User = require("../models/User");
const Role = require("../models/role");
const passport = require("passport");
const { userSchema, forgetSchema } = require("../validations/authValidation");
const {
  joiErrorFormatter,
  mongooseErrorFormatter,
} = require("../validations/validationFormatter");

exports.landing_page = (req, res) => {
  const error = req.session.error;
  res.render("login", { err: error });
};

exports.login_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
};

exports.register_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("register", { err: error });
};

exports.register_post = async (req, res) => {
  try {
    const validationResult = userSchema.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res.render("register", {
        errors: joiErrorFormatter(validationResult.error),
        err: "",
        formData: req.body,
      });
    }
    const {
      username = null,
      password = null,
      name = null,
      address = null,
    } = req.body;
    let user = await User.findOne({ username });

    if (user) {
      return res.render("register", {
        errors: {},
        err: "User already exists",
        formData: req.body,
      });
    }

    const role = await Role.findOne({ name: "user" });

    const hasdPsw = await bcrypt.hash(password, 12);
    user = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      username,
      password: hasdPsw,
      roles: [role._id],
      address,
    });
    await user.save();
    return res.render("login", {
      err: "You Are Sucessfully Register Now you can login ",
    });
  } catch (e) {
    return res.status(400).render("register", {
      errors: mongooseErrorFormatter(e),
    });
  }
};

exports.dashboard_get = (req, res) => {
  const username = req.session.username;
  res.render("dashboard", { name: username });
};

exports.logout_post = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
};

exports.forget_get = (req, res) => {
  const err = req.session.error;
  delete req.session.error;
  res.render("forgetPassword", { err: err });
};

exports.forget_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const validationResult = forgetSchema.validate(req.body, {
      abortEarly: false,
    });
    console.log(validationResult);
    if (validationResult.error) {
      return res.render("forgetPassword", {
        errors: joiErrorFormatter(validationResult.error),
        err: "",
        formData: req.body,
      });
    }

    const user = await User.findOne({ username: username });
    if (user) {
      const hasdPsw = await bcrypt.hash(password, 12);
      await User.updateOne({ _id: user._id }, { $set: { password: hasdPsw } });
      res.render("login", {
        err: "PassWord Change Sucessfully................!",
        errors: "",
        formData: "",
      });
    } else {
      res.render("forgetPassword", {
        err: "Sorry User Name Not Exist",
        errors: "",
        formData: req.body.username,
      });
    }
  } catch (e) {
    return res.status(400).render("forgetPassword", {
      errors: mongooseErrorFormatter(e),
    });
  }
};

exports.changePass_get = async (req, res) => {
  const err = req.session.error;
  delete req.session.error;
  res.render("changePassword");
};

exports.changePass_post = async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  const username = req.session.username;
  const hasdPswd = await bcrypt.hash(newpassword, 12);

  const user = await User.findOne({ username: username });

  const isMatch = await bcrypt.compare(oldpassword, user.password);

  if (isMatch) {
    await User.updateOne(
      { username: username },
      { $set: { password: hasdPswd } }
    );
    res.render("changePassword", {
      err: "Updated Change Sucessfully................!",
    });
  } else {
    res.render("changePassword", {
      err: "Passsword Not Updated.",
    });
  }
};
