const config = require("config");
const connectDB = require("./config/db");
const mongoURI = config.get("mongoURI");
const postRoutes = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const isAuth = require("./middleware/is-auth");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const express = require("express");
const {ensureAuthenticated}=require('./config/auth')

const app = express();

require('./config/passport')(passport);

// Db Connection
connectDB();
const store = new MongoDBStore({
  uri: mongoURI,
  collection: "mySessions",
});

// loading ejs pages
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);


app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Handling For Routes
app.use("/", adminRoute);
app.use("/", userRoute);
app.use("/", postRoutes);

app.get("/registerHref", (req, res) => {
  return res.render("register", { errors: {}, formData: {}, err: "" });
});
app.get("/addpost", ensureAuthenticated, (req, res) => {
  return res.render("addpost", { urlController: "NewPost" ,formData:{},errors:{}});
});

app.get("/getPostById", (req, res) => {
  return res.render("getPostById");
});

app.get("/giveComment", isAuth, (req, res) => {
  const user = req.query.user;
  const postId = req.query.postId;
  return res.render("comments", { user: user, postId: postId });
});

app.get("/forgetPaaword", (req, res) => {
  return res.render("forgetPassword", {errors: {}, formData: {},err: "" });
});

app.get("/changePassword", (req, res) => {
  return res.render("changePassword", { err: "" });
});

app.listen(4000, console.log("App Running on http://localhost:4000"));