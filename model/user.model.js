const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  googleId: String ,
  fullName :String  , 
  email  : String  , 
  cart_id: String , 
  phone: String  , 
  password : String , 
  tokenUser :String ,
  avatar:String , 
  address:[
    {
      addressInfor:{
        type: String  ,
        default: ""
      }, 
      defaultAddress: {
        type:Boolean  ,
        default: false
      }

    }
  ] ,
  deleted:{
    type:Boolean , 
    default: false
  } 
} , {
  timestamps: true
})
const user = mongoose.model("user" , userSchema , "users");
module.exports  = user;
