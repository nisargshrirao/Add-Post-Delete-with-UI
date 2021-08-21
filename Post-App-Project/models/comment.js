const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  comments: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId, ref: "Post" ,
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: {
    type: String,
  },
  deletedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default:Date.now()
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Comment", commentsSchema);