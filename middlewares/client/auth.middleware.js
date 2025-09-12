const Cart = require("../../model/cart.model");
const Account = require("../../model/accouns.model");
const Role = require("../../model/role.model");
const systemConfig = require("../../config/system.config");
const User = require("../../model/user.model");
const RoomChat = require("../../model/rooms-chats.model");

module.exports.Auth = async (req, res, next) => {
  try {
    const path = req.path;
    if (path.startsWith("/products/detail")) {
      if (!req.cookies.cartIdFlower) {
        console.log("cha vao warning");
        req.flash("warning", "Vui lòng đăng nhập để xem sản phẩm!");
        return res.redirect("/home");
      }
    }
    if (path != '/user/login' && path != "/user/logout" && path != '/user/signin' && path != '/user/password/forgot' &&
      path != '/user/password/otp' && path != "/user/password/reset") {

      if (!req.cookies.cartIdFlower) {
        return res.redirect(`/home`);
      } else {
        console.log("User has cartIdFlower");
      }
    }
    if (req.cookies.tokenUser) {
      const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false,
      });
      res.locals.user = user;
    } else {
      console.log("ko ti=on tai tokenn user");
    }
    console.log("sappp chayj vao");
    next();


  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }




}