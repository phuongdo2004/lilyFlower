const RoomChat = require("../../model/rooms-chats.model");
const User = require("../../model/user.model");
const Account = require("../../model/accouns.model");
const Chat = require("../../model/chats.model");
const streamUploadHelper = require("../../helpers/streamUpload.helper");

function parseCookies(cookieString) {
    const cookies = {};
    if (!cookieString) return cookies;
    cookieString.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        if (parts.length > 1) {
            cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('='));
        }
    });
    return cookies;
}

module.exports.chatSocket = async (io) => {
    io.on("connection", async (socket) => {
        console.log("ket noi chat.socket thanh cong admin");

        // Lắng nghe client join room và lưu roomChatId vào socket
        socket.on("JOIN_ROOM_ADMIN", async (data) => {
            socket.join(data.roomChatId);
            socket.tokenSale = data.tokenSale
            socket.roomChatId = data.roomChatId; // Lưu roomChatId vào đối tượng socket
            const tokenSale = socket.tokenSale;
            let sale;

            if (tokenSale) {
                const sale = await Account.findOne({
                    token: tokenSale,
                    deleted: false
                }).select("fullName , avatar , id");
                socket.sale = sale;
            }

            console.log("Admin đã join room:", data.roomChatId);
        });

        // Lắng nghe sự kiện gõ phím
        socket.on("CLIENT_SEND_TYPING", async (data) => {
            console.log("nhan dc", data);

            if (socket.sale) {
                const sale = socket.sale;
                // Sử dụng socket.roomChatId đã lưu
                socket.to(socket.roomChatId).emit("SERVER_SEND_TYPING", {
                    data: data.data,
                    userId: sale.id,
                    fullName: sale.fullName,
                });
            }

        });

        // Lắng nghe sự kiện gửi tin nhắn
        socket.on("CLIENT_SEND_MESSGAE", async (data) => {
            let dataReturn;
            const cookies = parseCookies(socket.handshake.headers.cookie);
            const tokenSale = cookies.tokenSale;

            const ArrayImages = [];
            for (const image of data.images) {
                const img = await streamUploadHelper(image);
                ArrayImages.push(img.url);
            }
            if (socket.sale) {
                const sale = socket.sale;
                dataReturn = {
                    fullName: sale.fullName,
                    avatar: sale.avatar,
                    content: data.message,
                    userId: " ",
                    saleId: sale.id, // Sử dụng id, không phải role_id
                    ArrayImages: ArrayImages,
                };

                // Lưu vào database

                saveChat(sale.id, socket.roomChatId, data.message, ArrayImages);
            }


            function saveChat(userId, roomChatId, message, images) {
                const chat = new Chat({
                    userId: userId,
                    roomChatId: roomChatId,
                    content: message,
                    images: images,
                });
                return chat.save();
            }

            // Trả lại Client 1 socket
            if (dataReturn) {
                // Sử dụng socket.roomChatId đã lưu
                io.to(socket.roomChatId).emit("SERVER__RETURN__MESSAGE", dataReturn);
            }
        });
    });
};