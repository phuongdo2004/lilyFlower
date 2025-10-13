const User = require("../../model/user.model");
const Chat = require("../../model/chats.model");
const streamUploadHelper = require("../../helpers/streamUpload.helper");

// Hàm để lấy cookie từ header của socket
function parseCookies(cookieString) {
  const cookies = {};
  if (!cookieString) return cookies;
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    cookies[parts[0].trim()] = decodeURIComponent(parts[1]);
  });
  return cookies;
}

module.exports.chatSocket = (io) => {
    io.on("connection", async (socket) => {
      console.log("Client đã kết nối thành công.");

      // Lắng nghe sự kiện client tham gia phòng chat
      socket.on("JOIN_ROOM", (roomChatId) => {
        socket.join(roomChatId);
        socket.roomChatId = roomChatId;
        console.log("join");
        console.log("Client đã join room:", roomChatId);
      });

      // Lắng nghe sự kiện client đang gõ phím
      socket.on("CLIENT_SEND_TYPING", async (data) => {
        const cookies = parseCookies(socket.handshake.headers.cookie);
        const tokenUser = cookies.tokenUser;
        
        if (tokenUser) {
          const user = await User.findOne({
            tokenUser: tokenUser,
            deleted: false
          }).select("fullName avatar id");
          
          if (user) {
            socket.to(socket.roomChatId).emit("SERVER_SEND_TYPING", {
              data: data.data,
              userId: user.id,
              fullName: user.fullName,
            });
          }
        }
      });

      // Lắng nghe sự kiện client gửi tin nhắn
      socket.on("CLIENT_SEND_MESSGAE", async (data) => {
        console.log("chay vao client send message")
        let dataReturn;
        const ArrayImages = [];

        for (const image of data.images) {
          const img = await streamUploadHelper(image);
          ArrayImages.push(img.url);
        }

        const cookies = parseCookies(socket.handshake.headers.cookie);
        const tokenUser = cookies.tokenUser;
        
        if (tokenUser) {
          const user = await User.findOne({
            tokenUser: tokenUser,
            deleted: false
          }).select("fullName avatar id");
          
          if (user) {
            dataReturn = {
              fullName: user.fullName,
              avatar: user.avatar,
              content: data.message,
              userId: user.id,
              saleId: " ",
              ArrayImages: ArrayImages,
            };

            // Lưu vào database
            const chat = new Chat({
              userId: user.id,
              roomChatId: socket.roomChatId,
              content: data.message,
              images: ArrayImages,
            });
            await chat.save();
          }
        }

        // Trả lại client một socket
        if( dataReturn){
          io.to(socket.roomChatId).emit("SERVER__RETURN__MESSAGE", dataReturn);
        }
        
      });
    });
};
