const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  _id: Schema.Types.ObjectId,
  tittle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user :{
      type:String,
      required:true
  },
  isDeleted:{
    type:Boolean,
    default:false
  } ,
  deletedBy:{
    type:String,    
  },
  deletedAt:{
    type:Date,  
  },
  createdAt:{
    type:Date,  
    default:Date.now()
  },
  updatedAt:{
    type:Date,
  }
});

module.exports = mongoose.model("Post", postSchema);
