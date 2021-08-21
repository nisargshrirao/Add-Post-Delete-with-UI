const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/User");
const Role = require("../models/role");
const Comment = require("../models/comment");

exports.userList = async (req, res, next) => {
  try {
    const allUser = await User.find({ isDeleted: false }).populate(
      "roles",
      "name -_id"
    );
    res.render("adminPanel", {
      users: allUser,
    });
  } catch (error) {
    return next(error);
  }
};

exports.makeAdmin = async (req, res, next) => {
  const id = req.query.id;
  const adminRole = await Role.findOne({ name: "admin" });
  try {
    await User.updateOne(
      { _id: id },
      { $addToSet: { roles: [adminRole._id] }, updatedAt: new Date() }
    );
    const users = await User.find({ isDeleted: false }).populate(
      "roles",
      "name -_id"
    );
    return res.render("adminPanel", {
      users
    });
  } catch (error) {
    return next(error);
  }
};

exports.removeFromAdmin = async (req, res, next) => {
  const id = req.query.id;
  const adminRole = await Role.findOne({ name: "admin" });
  try {
    await User.updateOne(
      { _id: id },
      { $pull: { roles: { $in: [adminRole._id] } }, updatedAt: new Date() }
    );
    const users = await User.find({ isDeleted: false }).populate(
      "roles",
      "name -_id"
    );
    return res.render("adminPanel", {
      users,
      });
  } catch (error) {
    return next(error);
  }
};

exports.showpostToAdmin = async (req, res, next) => {
  const allUser = await Post.find({ isDeleted: false });
  try {
    res.render("allPostAdmin", {
      users: allUser,
      usersession: req.session.username,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const id = req.query.postId;
  const usernName = req.session.username;
  try {
    await Post.updateOne(
      { _id: id },
      {
        $set: { isDeleted: true },
        deletedBy: userName,
        deletedBy: req.session.username,
      }
    );

    const users = await Post.find({ isDeleted: false });
    return res.render("allPostAdmin", {
      users: users,
      usersession: req.session.username,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updatePostByAdmin = async (req, res, next) => {
  const tittle = req.body.tittle;
  const description = req.body.description;
  const postId = req.body.postId;

  try {
    await Post.updateOne(
      { _id: postId },
      {
        $set: {
          tittle: tittle,
          description: description,
          updatedAt: new Date(),
        },
      }
    );
    const users = await Post.find({ isDeleted: false });

    return res.render("allPostAdmin", {
      users,
    });
  } catch (error) {
    return next(error);
  }
};

exports.seeAllCommentsAdmin = async (req, res, next) => {
  let id = req.query.postId;
  try {
    const comm = await Comment.find({ post: id, isDeleted: false });
    if (comm) {
      return res.render("deleteCommentUser", { comments: comm });
    } else {
      res.json({ message: "No Comments Availables" });
    }
  } catch (error) {
    return error;
  }
};
exports.editPost = async (req, res, next) => {
  const postId= req.query.postId; 
    Post.findOne({ _id: postId })
      .then((allPost) => {        
          return res.render('addpost', {
          postId: allPost._id,
          tittle: allPost.tittle,
          description : allPost.description,
          urlController: "editByAdmin"       
        });
      })
      .catch((err) => {
        const error = new Error(err);  
        return next(error)
    });

};
