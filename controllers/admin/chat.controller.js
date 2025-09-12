const User = require("../../model/user.model");
const socketChat = require("../../socket/admin/chat.socket");
const Account= require("../../model/accouns.model");
const RoomChat = require("../../model/rooms-chats.model");
const Chat = require("../../model/chats.model");
module.exports.index = async( req , res)=>{
  try {
     const chats = await Chat.find({
  });
    const users = await User.find({
  deleted: false ,
})
const account = await Account.findOne({ token: req.cookies.token });
const role_id = account.role_id;
  // res.render("admin/pages/chats/index.pug", { users  , role_id });
  res.json({
    code: 200 , 
    chats : chats,
  })
  
    
  } catch (error) {
    console.log("Error in chat controller index: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }

  }
module.exports.detail = async( req , res)=>{
  try {
     const roomChatId = req.params.idRoomchat;
    const users = await User.find({
      deleted: false ,
    });
    // gans cho cacs user co roomChat
    for (const user of users) {
      const roomChat = await RoomChat.findOne({
        'user.userId': user._id ,
        deleted: false ,
      }).select("_id");
      user.roomChat = roomChat._id;
      
    }


    const account = await Account.findOne({ token: req.cookies.token });
    const roomChat = await RoomChat.findOne({
      deleted: false,
      _id: roomChatId ,
      // 'user.userId': id, // Thay '6818207067dd54cf688b428c' bằng userId bạn muốn tìm
    });
    const idRoomChat = roomChat._id;
// lay idd cuar user trong roomChat
console.log(roomChat.user);
const id = (roomChat.user[0]).userId;

socketChat.chatSocket(req, res, id, idRoomChat);

  const chats = await Chat.find({
    roomChatId: idRoomChat
  });
for (const chat of chats) {
//   tìm thông tin ng gui là o User
  const infoUser = await User.findOne({
    _id: chat.userId,
  }).select("fullName , avatar");
  chat.infoUser = infoUser;

  
}
// console.log("chats" , chats);
const role_id = account.role_id;

// console.log("account", account.id);
      res.render("admin/pages/chats/detail.pug" , {
        users,
        role_id,
        chats,
        AccountId: account.id,
      });


    
  } catch (error) {
    console.log("Error in chat controller detail: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }
   
    }