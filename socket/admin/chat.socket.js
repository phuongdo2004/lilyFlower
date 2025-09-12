const RoomChat = require("../../model/rooms-chats.model");
const User = require("../../model/user.model");
const Account = require("../../model/accouns.model");
const Chat = require("../../model/chats.model");
const streamUploadHelper = require("../../helpers/streamUpload.helper");
module.exports.chatSocket = async (req, res, id, idRoomChat) => {
  // truy van ra ng con lai trong rôm chat do 


  _io.on("connection", async (socket) => {

    console.log("chuan bi gop phong chat admin", );
    // socket.join(roomChatId);
    console.log("ket noi chat.socket thanh cong admin");
     // Lắng nghe client join room
    socket.on("JOIN_ROOM", (roomChatId) => {
      socket.join(roomChatId);
      socket.roomChatId = roomChatId;
      console.log("Client đã join room:", roomChatId);
    });
    socket.on("CLIENT_SEND_TYPING", async (data) => {
      // console.log("data admin", data);
      // console.log(" socket admin  dang go", data);
      if (req.cookies.tokenSale) {
        const sale = await Account.findOne({
          token: req.cookies.tokenSale,
          deleted: false
        }).select("fullName , avatar , id , role_id");
       
          const fullName = sale.fullName;
          const id = sale.id;
        
        socket.to(idRoomChat).emit("SERVER_SEND_TYPING", {
          data: data.data,
          userId: id,
          fullName: fullName,
        });

      }



    });



    // CLIENT__SEND_TYPING



    socket.on("CLIENT_SEND_MESSGAE", async (data) => {
      let dataReturn;
      // console.log("data", data);
      const ArrayImages = [];

      for (const image of data.images) {
        const img = await streamUploadHelper(image);
        ArrayImages.push(img.url);
      }
      // console.log("array image", ArrayImages);

      if (data.tokenSale) {
        const sale = await Account.findOne({
          token: data.tokenSale,
          deleted: false
        }).select("fullName , avatar , id , role_id");

        dataReturn = {
          fullName: sale.fullName,
          avatar: sale.avatar,
          content: data.message,
          saleId: sale.role_id,
          ArrayImages: ArrayImages,

        }
        saveChat(sale.id, idRoomChat, data)

        // 
      }
      // else if(data.tokenUser){
      //   const user = await User.findOne({
      //     tokenUser: data.tokenUser ,
      //     deleted :false
      //   }).select("fullName , avatar  ,id");

      //   dataReturn   = {
      //     fullName: user.fullName , 
      //     avatar: user.avatar , 
      //     content: data.message , 
      //     userId : user.id ,
      //     ArrayImages: ArrayImages,
      //    content: data.message,
      //   }
      //   saveChat(user.id , idRoomChat , data)


      // }
      // luu vao database
      function saveChat(userId, idRoomChat, data) {
        const chat = new Chat({
          userId: userId,
          roomChatId: idRoomChat,
          content: data.message,
          images: ArrayImages,
        });
        return chat.save();
      }
      // console.log("dataReturn", dataReturn);

      // trar lai Client 1 socket 
      _io.to(idRoomChat).emit("SERVER__RETURN__MESSAGE", dataReturn);


    })
  })


}