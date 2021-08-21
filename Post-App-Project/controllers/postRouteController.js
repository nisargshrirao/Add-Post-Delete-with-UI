const mongoose = require("mongoose");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { addSchema } = require("../validations/authValidation");
const {joiErrorFormatter,mongooseErrorFormatter} = require("../validations/validationFormatter");


exports.addNewPost = async (req, res) => {
  const tittle = req.body.tittle;
  const description = req.body.description;
  const username = req.user.username;

  try {
    const validationResult = addSchema.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res.render("addpost", {
        errors: joiErrorFormatter(validationResult.error),
        err: "",
        formData: req.body,
        urlController: "NewPost"
      });
    }
    post = new Post({
      _id: new mongoose.Types.ObjectId(),
      user: username,
      tittle: tittle,
      description: description,
      });
    await post.save();
    res.redirect("/getallPost");
  }catch (e) {
    return res.status(400).render("getallPost", {
      errors: mongooseErrorFormatter(e),
    });
  }   
};

exports.getUserPost = async (req, res, next) => {
  const allPost = await Post.find({
    user: req.user.username,
    isDeleted: false,
  });
  try {
    if (!allPost.length == 0) {
      res.render("getallPost", {
        prods: allPost,
        usersession: req.user.username,
        totalPost: allPost.length,
        err: "Total Number Of Records",
      });
    } else {
      res.render("getallPost", {
        err: " Sorry No Post Found",
        prods: "",
        usersession: req.user.username,
        totalPost: "",
      });
    }
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};

exports.getAllUserPost = async (req, res, next) => {
  try {
    const allPost = await Post.find({isDeleted:false});
    if (!allPost.length == 0) {
      res.render("allUserPost", {
        posts: allPost,
        usersession: req.user.username,
        err: "",
        totalPost: allPost.length,
      });
    } else {
      res.render("allUserPost", {
        err: " Sorry No Post Found",
        posts: "",
        usersession: req.user.username,
        totalPost: "",
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  let _id = req.query.postId;
  try {
    const postInfo = await Post.find({ _id: _id, isDeleted: false });
    if (postInfo) {
      res.json(postInfo);
    } else {
      res.status(404).json({ message: "No valid entry found for provided ID" });
    }
  } catch (err) {
    return next(error);
  }
};

exports.deletePostUser = async (req, res, next) => {
  const id = req.query.postId;
  const user = req.query.user;
  try {
    await Post.updateOne(
      { _id: id },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );
    const users = await Post.find({
      user: user,
      isDeleted: false,
     });

    return res.render("getallPost", {
      prods: users,
      usersession: req.user.username,
      err: "Post Deleted",
      totalPost: "",
    });
  } catch (error) {
    return error;
  }
};

exports.addYourComments = async (req, res) => {
  const comm = new Comment({
    _id: new mongoose.Types.ObjectId(),
    comments: req.body.comment,
    post: req.body.postId,
    user: req.body.user,
  });
  
  await comm
    .save()
    .then((result) => {
      res.json(result),
      {
        response: result,
      };
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.seeAllComments = async (req, res, next) => {
  let _id = req.query.postId;
  try {
    const comm = await Comment.find({ post: _id, isDeleted: false })
      .select()
      .populate({ path: "post", select: ["tittle", "description"] });
    if (comm) {
      return res.json(comm);
    } else {
      res.json({ message: "No Comments Availables" });
    }
  } catch (error) {
    return error;
  }
};

exports.findAllComment = async (req, res, next) => {
  let _id = req.query.postId;
  try {
    const comm = await Comment.find({ post: _id, isDeleted: false });

    if (comm) {
      return res.render("deleteCommentUser", { comments: comm });
    }
    else {
      res.json({ message: "No Comments Availables" });
    }
  } catch (error) {
    return error;
  }
};
exports.deleteComments = async (req, res, next) => {
  const id = req.query.commentsId;
  const postId = req.query.postId;
  try {
    await Comment.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: req.user.username,
        },
      }
    );

    const comments = await Comment.find({ post: postId, isDeleted: false });
    return res.render("deleteCommentUser", {
      comments: comments,
    });
  } catch (error) {
    return error;
  }
};
exports.updatePostByUser = async (req, res, next) => {
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
    const users = await Post.find({
      user: req.user.username,
      isDeleted: false,
    });

    return res.render("getallPost", {
      prods: users,
      usersession: req.user.username,
      err: "Post Update Sucessfully....",
      totalPost: "",
    });
  } catch (error) {
    return error;
  }
};

exports.editComments = async (req, res, next) => {
  const commId = req.query.commentsId;
  const comments = await Comment.findOne({ _id: commId });
  return res.render("editComment", {
    comment: comments.comments,
    postId: comments.post,
    usersession: req.user.username,
  });
};

exports.updateComment = async (req, res) => {
  const postId = req.body.postId;
  const comment = req.body.comment;

  try {
    await Comment.updateOne(
      { post: postId },
       { $set: 
        { 
          comments: comment
         }
         });
    const comm = await Comment.find({ post: postId, isDeleted: false });

    if (comm) {
      return res.render("deleteCommentUser", { comments: comm });
    } else {
      res.json({ message: "No Comments Availables" });
    }
  } catch (error) {
    return error;
  }
};

exports.editPostUser=async(req,res)=>{
  const postId= req.query.postId; 
    Post.findOne({ _id: postId })
      .then((allPost) => {        
          return res.render('addpost', {
          postId: allPost._id,
          tittle: allPost.tittle,
          description : allPost.description,
          urlController: "editByUser"    
        });
      })
      .catch((err) => {
        const error = new Error(err);  
        return next(error)
    });
}
