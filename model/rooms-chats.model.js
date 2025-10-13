const mongoose = require("mongoose");
// Vui lòng kiểm tra lại nếu bạn có file 'cart.model' và hàm 'applyTimestamps'
// Nếu không, hãy xóa dòng sau: const { applyTimestamps } = require("./cart.model");

const roomChatShema = mongoose.Schema({
    title: {
        admin: String,
        client: String,
    }, 
    // KHẮC PHỤC LỖI: Định nghĩa rõ ràng các trường có thể có trong MỌI phần tử của mảng.
    user: [
        {
            userId: { type: String, required: false }, // ID của khách hàng
            saleId: { type: String, required: false }, // ID của nhân viên bán hàng
            // Mongoose sẽ lưu tất cả các trường được định nghĩa này.
        }
    ], 
    deleted: {
        type: Boolean, 
        default: false
    }
}, {
    timestamps: true 
});

const RoomChat = mongoose.model("RoomChat", roomChatShema, "rooms-chat");

module.exports = RoomChat;