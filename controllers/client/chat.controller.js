const RoomChat = require("../../model/rooms-chats.model");
const Chat = require("../../model/chats.model");
const chatSocket = require("../../socket/client/chat.socket");
const User = require("../../model/user.model");
const Account = require("../../model/accouns.model");

module.exports.index = async( req , res)=>{
const user = await User.findOne({ tokenUser : req.cookies.tokenUser });
try {
   const roomChatId = req.cookies.roomChat;
  //  chatSocket.chatSocket(req , res ,roomChatId);
 
  const chats = await Chat.find({
    roomChatId: roomChatId  ,
  });
for (const chat of chats) {
  //  tim thông tin ng gui la o Account 
  const infoUser = await Account.findOne({
    _id: chat.userId,
  }).select("fullName , avatar");
chat.infoUser = infoUser;
}

  res.render("client/pages/chat/index.pug" , {

    user:user ,
    chats: chats,
  });

  
} catch (error) {
  console.log("Error in chat controller index: ", error);
  res.status(500).send("Internal Server Error");
  return;
  
}
 



}

