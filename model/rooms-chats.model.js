const mongoose = require("mongoose");
const { applyTimestamps } = require("./cart.model");
const roomChatShema = mongoose.Schema({
title:{
  admin : String , 
  client: String, 
} , 

user:[
  {
    userId: String , 
  }  , 
  {
    saleIds: String ,
  }
] , 
deleted:{
  type: Boolean, 
  default: false
}
}, {
  timestamps: true 
}) ;
const RoomChat  = mongoose.model("RoomChat" , roomChatShema , "rooms-chat");


module.exports = RoomChat;
