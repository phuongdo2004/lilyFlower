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
    // console.log("chay vao cart");
    const path = req.path;
    if (path != '/user/login' &&
       path != "/user/logout" && 
       path != '/user/signin' && 
       path != '/user/password ') {
      let cart;
      if (!req.cookies.cartIdFlower) {
      } else { 
        // console.log("cart ban dau" , req.cookies.cartIdFlower);
        cart = await Cart.findOne({
          _id: req.cookies.cartIdFlower,
        })
        if(cart){
          // console.log("cartqq", cart);
          res.locals.cartTotal = cart.products.length || 0;

        }else{
          const cart = new Cart();
          await cart.save();
          // console.log(cart);
          // console.log("cartId", cart.id);
          // console.log("cookies", req.cookies.tokenUser);
          await User.updateOne({
            tokenUser: req.cookies.tokenUser,
          } , {
            cart_id : cart.id
          })
          res.locals.cartTotal = cart.products.length || 0;
        }
        
      }
    } else {
    }
  next();   
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
//  next();
}