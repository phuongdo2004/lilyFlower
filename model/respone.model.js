const mongoose  = require("mongoose");
const responeSchema = new mongoose.Schema({
  name : String , 
  email: String , 
  phone : Number ,
  message : String  , 
   deleted:{
    type:Boolean , 
    default: false
  }
}, {
  timestamps: true
}
)
const respone  = mongoose.model("Respone" , responeSchema  ,"response");
module.exports  = respone;
