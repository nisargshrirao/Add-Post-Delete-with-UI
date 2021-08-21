const Role = require("../models/role");
const adminrole = Role.findOne({ name: "admin" });
module.exports = (req, res, next) => {
    if (req.session.isAuthAdmin && req.session.roles===adminrole._id) {
      next();
    } else {
      req.session.error = "You have to Login first";
      res.redirect("/login");
    }
  };
  