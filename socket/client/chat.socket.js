const RoomChat = require("../../model/rooms-chats.model");
const User = require("../../model/user.model");
const Account = require("../../model/accouns.model");
const Chat = require("../../model/chats.model");
const streamUploadHelper = require("../../helpers/streamUpload.helper");

function parseCookies(cookieString) {
  console.log(cookieString);
  const cookies = {};
  if (!cookieString) return cookies;
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    cookies[parts[0].trim()] = decodeURIComponent(parts[1]);
  });
  return cookies;
}
module.exports.chatSocket = async (req, res) => {
  // truy van ra ng con lai trong rôm chat 
  
  _io.on("connection", async (socket) => {

    console.log("chuan bi gop phong chat client ", );
    // socket.join(roomChatId);
    console.log("ket noi chat.socket thanh cong client");
     // Lắng nghe client join room
    socket.on("JOIN_ROOM", (roomChatId) => {
      socket.join(roomChatId);
      socket.roomChatId = roomChatId;
      console.log("Client đã join room:", roomChatId);
    });
    // CLIENT__SEND_TYPING 
    socket.on("CLIENT_SEND_TYPING", async (data) => {
     console.log("ooo");
      // console.log(req.cookies.tokenUser);
    const cookies = parseCookies(socket.handshake.headers.cookie);
    console.log("cookies");
    console.log(cookies);
    const tokenUser = cookies.tokenUser;
      if (tokenUser) {
        const user = await User.findOne({
          tokenUser: tokenUser,
          deleted: false
        }).select("fullName , avatar  ,id");
      //  console.log(roomChatId);
        socket.to(socket.roomChatId).emit("SERVER_SEND_TYPING", {
          data: data.data,
          userId: user.id,
          fullName: user.fullName,
        });

      }






    });



    // CLIENT__SEND_TYPING


    socket.on("CLIENT_SEND_MESSGAE", async (data) => {
      let dataReturn;
      // console.log("chay vao");
      const ArrayImages = [];

      for (const image of data.images) {
        const img = await streamUploadHelper(image);
        ArrayImages.push(img.url);
      }
      // console.log("array image", ArrayImages);


      // if( data.tokenSale){
      //   const sale = await Account.findOne({
      //     token: data.tokenSale ,
      //     deleted :false
      //   }).select("fullName , avatar , id , role_id");

      //    dataReturn   = {
      //     fullName: sale.fullName , 
      //     avatar: sale.avatar , 
      //     content: data.message , 
      //     saleId : sale.role_id ,
      //     ArrayImages: ArrayImages,
      //   }
      //   saveChat(sale.role_id , roomChatId , data)

      // }
      if (data.tokenUser) {
        const user = await User.findOne({
          tokenUser: data.tokenUser,
          deleted: false
        }).select("fullName , avatar  ,id");

        dataReturn = {
          fullName: user.fullName,
          avatar: user.avatar,
          content: data.message,
          userId: user.id,
          ArrayImages: ArrayImages,
        }
        saveChat(user.id, socket.roomChatId, data)
      }
      // luu vao database
      function saveChat(userId, roomChatId, data) {
        const chat = new Chat({
          userId: userId,
          roomChatId: roomChatId,
          content: data.message,
          images: ArrayImages,
        });
        return chat.save();
      }

      // trar lai Client 1 socket 
      _io.to(socket.roomChatId).emit("SERVER__RETURN__MESSAGE", dataReturn);


    })

  })


}