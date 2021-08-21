const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  _id: Schema.Types.ObjectId,

  name: {
    type: String,
    required: true
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
  },
  updatedAt:{
    type:Date,
  }
});

module.exports = mongoose.model("Role", roleSchema);
