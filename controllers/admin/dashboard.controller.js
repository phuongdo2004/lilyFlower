const User = require("../../model/user.model");
const Products = require("../../model/products.model");
const Order = require("../../model/order.model");
const Comment = require("../../model/comment.model");
const RoomChat = require("../../model/rooms-chats.model");


module.exports.index = async (req, res) => {
  try {
    var totalUsers = 0;
    var totalProducts = 0;
    var totalComments = 0;
    var totalOrders = 0;

    // Lay ra tổng số khách hàng 
    totalUsers = (await User.find({})).length;
    // Lay ra tong so san pham
    totalProducts = (await Products.find({})).length;
    // lay ra tong so don hang 
    totalOrders = (await Order.find({})).length;
    // Lay ra tong so binh luan
    totalComments = (await Comment.find({})).length;
    //  lay ra nhưng don hang gan nhat
    const ordersLatest = await Order.find({

    }).sort({ createdAt: "desc" })
      .limit(10);

    // them ten , price cho don hang
    var listOrderRecent = [];
    var listUserId = [];


    for (const item of ordersLatest) {
      // lay ra fullName phone cua khach han moi nhat 
      var exitUserId = listUserId.find(ele => ele === item.userInfo.userId);
      if (!exitUserId) {
        listUserId.push(item.userInfo.userId);

      }
      // ten đầu tiên của item
      const firstItem = (item.products)[0];
      const productId = firstItem.productId;
      const inforOrder = await Products.findOne({
        _id: productId,

      }).select("title");
      item.id = inforOrder.id;

      // Lay price discount cua tung san pham 
      var totalPrice = 0;
      for (const product of item.products) {
        //lay ra price    
        var currentPrice = Number(((1 - product.discountPercentage / 100) * product.price).toFixed(0));
        totalPrice += Number(currentPrice * product.quantity);
      }
      item.totalPrice = totalPrice;

    }
    console.log(listUserId);
    for (const id of listUserId) {
      console.log("id" , id);
      const inforClient = await User.findOne({
        _id: id,
      }).select("avatar fullName email");
      const roomChat = await RoomChat.findOne({
        'user.userId': id,
        deleted: false,
      }).select("id");  
      console.log("roomChat" , roomChat);
      listOrderRecent.push({
        IdRoomChat: roomChat._id,
        avatar: inforClient.avatar,
        email: inforClient.email,
        fullName: inforClient.fullName
      })
    }
    res.render("admin/pages/index.pug", {
      ordersLatest: ordersLatest,
      totalOrders: totalOrders,
      totalProducts: totalProducts,
      totalUsers: totalUsers,
      totalComments: totalComments,
      listClientRecent: listOrderRecent,
      message: req.flash()
    });

  } catch (error) {
    console.log("Error in admin dashboard index: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }
}