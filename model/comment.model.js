const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
   fullName: String , 
  email: String , 
  phone : String  , 
  message: String ,

} , {
  timestamps:true,
})
const Comment = mongoose.model("Comment" ,CommentSchema , "comments");
module.exports = Comment;