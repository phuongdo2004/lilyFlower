const Cart = require("../../model/cart.model");
const Account = require("../../model/accouns.model");
const Role = require("../../model/role.model");
const RoomChat = require("../../model/rooms-chats.model");
const {
  createCollection
} = require("../../model/user.model");
const User = require("../../model/user.model");

module.exports.cartId = async (req, res, next) => {
  try {
   
      let cart;
      if (!req.cookies.cartIdFlower) {
        console.log("khong co cart");
      } else { 
        cart = await Cart.findOne({
          _id: req.cookies.cartIdFlower,
        })
        res.locals.cartTotal = cart.products.length || 0;
        
       
   
  }  next();
 } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
//  next();

}