const RoomChat = require("../../model/rooms-chats.model");
const Role = require("../../model/role.model");
const Account = require("../../model/accouns.model");
const chatController = require("../../controllers/chat.controller");

module.exports.Auth = async( req  , res)=>{

//  // Đoạn này chỉ chạy khi xác thực thành công
//         console.log("okeee");
//         // req.user chắc chắn có ở đây
//         console.log("Ma uy quyen", req.user);
try {
      const roleSale = await Role.findOne({
          title: "sale",
          deleted: false,
    }).select("_id");
    
        const sale = await Account.findOne({
          role_id: roleSale.id,
          deleted: false,
          status: "active",
        })
    
        if (!sale) {
          console.log("chua co sale")
    
        } else {
    
          res.locals.sale = sale;
          
        }
        const roomChat = await RoomChat.findOne({
            deleted: false,
            'user.userId': req.user._id,

        });
        if (roomChat) {
            res.locals.roomChatId = roomChat.id;
            console.log("tim dcc phong chat" ,roomChat.id);
    

        } else {
            console.log("ko tim ddc phong chat");
            chatController.createRoomChat(req , res , req.user.id , req.user.fullName);

        }
                   

        // Set cookie nếu cần
         res.locals.user = req.user;
         console.log("res.local.user" , res.locals.user);

        res.cookie("tokenUser", req.user.tokenUser, { path: '/' });
        res.cookie("cartIdFlower", req.user.cart_id, { path: '/' });
req.flash("success", "Đăng nhập thành công!");
        res.redirect('/products');
} catch (error) {
  console.error("Lỗi khi xác thực:", error);
  return res.status(500).send("Lỗi khi xác thực");
  
}


}



