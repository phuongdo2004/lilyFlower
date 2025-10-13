const RoomChat = require("../../model/rooms-chats.model");
const Chat = require("../../model/chats.model");
const chatSocket = require("../../socket/client/chat.socket");
const User = require("../../model/user.model");
const Account = require("../../model/accouns.model");

module.exports.index = async( req , res)=>{
  console.log("chay vao dung");
const user = await User.findOne({ tokenUser : req.cookies.tokenUser });
try {
   const roomChatId = req.cookies.roomChat|| res.locals.roomChatId;
  //  chatSocket.chatSocket(req , res ,roomChatId);
 console.log("roomChatId" , roomChatId);
  // BƯỚC QUAN TRỌNG: Thêm .lean() để lấy về đối tượng JS thuần túy
  const chats = await Chat.find({
    roomChatId: roomChatId  ,
  }).lean(); // <-- Chỉ cần thêm .lean()

  // console.log("chat" , chats);
  
for (const chat of chats) {
  //  tim thông tin ng gui la o Account 
  const inforSale = await Account.findOne({
    _id: chat.userId,
  }).select("fullName avatar").lean(); // <-- Thêm .lean() ở đây cũng tốt
  
  if( inforSale){
    chat.inforSale = inforSale; // Việc gán thuộc tính mới bây giờ là hợp lệ
  }

}
console.log("chat" , chats);
// console.log("chat" , chats);
  res.render("client/pages/chat/index.pug" , {
    user:user ,
    chats: chats, // Vẫn sử dụng chats vì nó đã là JS Objects rồi
  });

} catch (error) {
  console.log("Error in chat controller index: ", error);
  res.status(500).send("Internal Server Error");
  return;
  
}
 
}
