const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
    password: {
    type: String,
    required: true
  },
   email:{
       type :String     
    },
    telephone :{
      type: String
    },
  roles: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Role" ,
    type:Schema.Types.ObjectId,
    required :true, 
  }],
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

module.exports = mongoose.model("User", userSchema);
