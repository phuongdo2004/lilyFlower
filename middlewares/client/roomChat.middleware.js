const RoomChat = require("../../model/rooms-chats.model");
const User = require("../../model/user.model");
module.exports.findRoomChat = async (req, res ,next) => {
// kiem sale
  // const roleSale = await Role.findOne({
  //   title: "sale",
  //   deleted: false,
  // }).select("_id -password");

  // const sale = await Account.findOne({
  //   role_id: roleSale.id,
  //   deleted: false,
  //   status: "active",
  // }).select("-password");
  // if (!sale) {
  //   console.log("chua co sale")
  // } else {
  //   res.locals.sale = sale;
  // }


  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      deleted: false,
      tokenUser: req.cookies.tokenUser
    })
    if (user) {
      const roomChat = await RoomChat.findOne({
        deleted: false,
        'user.userId': user._id,

      });
      if (roomChat) {
        res.locals.roomChatId = roomChat.id;
        res.cookie("roomChat" , roomChat.id);
        console.log("tim dcc phong chat", roomChat.id);
      } else {
        console.log("ko tim ddc phong chat");
      }
    } else {
      console.log("ko tim thay user de tim phong chat");
    }
    next();

  }
}