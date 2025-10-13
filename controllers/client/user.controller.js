const RoomChat = require("../../model/rooms-chats.model");
const User = require("../../model/user.model");
const generateHelper = require("../../helpers/generate.helper");
var md5 = require('md5');
const Order = require("../../model/order.model");
const Product = require("../../model/products.model");
const user = require("../../model/user.model");
const Account = require("../../model/accouns.model");
const Cart = require("../../model/cart.model");
const chatController = require("../../controllers/chat.controller");
const forgotPassword = require("../../model/forgot-password.model");
const sendEmailHelper = require("../../helpers/sendMail.helper");
const MailMessage = require("nodemailer/lib/mailer/mail-message");

module.exports.signin = async (req, res) => {
  try {
    const existUser = await User.findOne({
      fullName: req.body.fullName,
      email: req.body.email,
      deleted: false,
    });
    if (existUser) {
      return res.redirect("/home");
    } else {
      const cart = new Cart();
      await cart.save();


      // Thiết lập cookie cartIdFlower nếu chưa tồn tại
      if (!req.cookies.cartIdFlower) {
        res.cookie("cartIdFlower", cart.id, {
          path: '/'
        });
      }

      const userData = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        tokenUser: generateHelper.generateRandomString(30),
        cart_id: req.cookies.cartIdFlower || cart.id, // Ưu tiên cookie nếu có, nếu không dùng cart.id mới tạo
      };
      if (!req.body.avatar) {
        userData.avatar =
          "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg";
      }
      const user = new User(userData);
      await user.save();


      res.cookie("tokenUser", user.tokenUser, {
        path: '/'
      });


      await chatController.createRoomChat(req, res, user.id, user.fullName);
      res.redirect("/products");

    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// POST login start
module.exports.login = async (req, res) => {
  try {
    const existUser = await User.findOne({
      fullName: req.body.fullName,
      password: md5(req.body.password)
    });
    if (!existUser) {
      req.flash("error", "Tài khoản không tồn tại!"); // Use 'error' flash message
      return res.redirect("/login"); //  Redirect on failure AND RETURN
    } else {
      const cart = await Cart.findOne({
        _id: existUser.cart_id,
      })
      res.locals.cartTotal = cart.products.length || 0;
      res.cookie("tokenUser", existUser.tokenUser);
      res.cookie("cartIdFlower", existUser.cart_id);
      req.flash("success", "Đăng nhập thành công!");
      res.redirect("/products");

    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");

  }



}
// POST login end
// GET logout

module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartIdFlower");
  res.redirect("/home");
}

// Listorder   GET /user/order
// Trong controller
function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
module.exports.ListOrder = async (req, res) => {
  try {

    var listOrder = [];
    // lay ra danh sach don hang cua ng dung 
    const tokenUser = req.cookies.tokenUser;
    const userId = await User.findOne({
      deleted: false,
      tokenUser: tokenUser,
    })
    const orders = await Order.find({
      'userInfo.userId': userId.id,
    });
    for (const order of orders) {
      let orderObj = order.toObject();
      orderObj.price = 0;
      const firstOrder = order.products[0];
      const firstOdrderImage = await Product.findOne({
        _id: firstOrder.productId,
        deleted: false,
      });
      orderObj.firstOdrderImage = firstOdrderImage.thumbnail;

      for (const element of order.products) {
        const info = await Product.findOne({
          _id: element.productId
        }).select(" price discountPercentage");
        const priceNew = ((1 - info.discountPercentage / 100) * info.price).toFixed(0);
        info.priceNew = priceNew;
        orderObj.price += Number(priceNew * element.quantity);
        orderObj.createdAtFormatted = formatDate(order.createdAt);
      }
      listOrder.push(orderObj);

    }
    const user1 = await user.findOne({
      tokenUser: tokenUser,
    });
    res.render("client/pages/user/order.pug", {
      products: listOrder,
      user: user1
    });

  } catch (error) {
    console.log("Lỗi khi lấy danh sách đơn hàng: ", error);
    return res.status(500).send("Internal Server Error");

  }


}
module.exports.ListOrder2 = async (req, res) => {
  try {
    var listOrder = [];
    // lay ra danh sach don hang cua ng dung 
    const tokenUser = req.cookies.tokenUser;
    const userId = await User.findOne({
      deleted: false,
      tokenUser: tokenUser,
    })
    const orders = await Order.find({
      'userInfo.userId': userId.id,

    });


    for (const order of orders) {
      let orderObj = order.toObject();
      orderObj.price = 0;
      const firstOrder = order.products[0];
      const firstOdrderImage = await Product.findOne({
        _id: firstOrder.productId,
        deleted: false,
      });
      orderObj.firstOdrderImage = firstOdrderImage.thumbnail;

      for (const element of order.products) {
        const info = await Product.findOne({
          _id: element.productId
        }).select(" price discountPercentage");
        const priceNew = ((1 - info.discountPercentage / 100) * info.price).toFixed(0);
        info.priceNew = priceNew;
        orderObj.price += Number(priceNew * element.quantity);
        orderObj.createdAtFormatted = formatDate(order.createdAt);
      }
      listOrder.push(orderObj);

    }
    res.json({
      orders: listOrder,
    })

  } catch (error) {
    console.log("Lỗi khi lấy danh sách đơn hàng: ", error);
    return res.status(500).send("Internal Server Error");

  }


}

module.exports.listOrderComplete = async (req, res) => {
  try {
    var listOrder = [];
    // lay ra danh sach don hang cua ng dung 
    const tokenUser = req.cookies.tokenUser;
    const userId = await User.findOne({
      deleted: false,
      tokenUser: tokenUser,
    }).select("_id")
    const orders = await Order.find({
      'userInfo.userId': userId.id,
      status: "Đã giao"
    });


    for (const order of orders) {
      let orderObj = order.toObject();
      orderObj.price = 0;
      const firstOrder = order.products[0];
      const firstOdrderImage = await Product.findOne({
        _id: firstOrder.productId,
        deleted: false,
      });
      orderObj.firstOdrderImage = firstOdrderImage.thumbnail;

      for (const element of order.products) {
        const info = await Product.findOne({
          _id: element.productId
        }).select(" price discountPercentage");
        const priceNew = ((1 - info.discountPercentage / 100) * info.price).toFixed(0);
        info.priceNew = priceNew;
        orderObj.price += Number(priceNew * element.quantity);
        orderObj.createdAtFormatted = formatDate(order.createdAt);
      }
      listOrder.push(orderObj);

    }
    const user1 = await user.findOne({
      tokenUser: tokenUser,
    });
    res.json({
      orders: listOrder,

    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách đơn hàng: ", error);
    return res.status(500).send("Internal Server Error");

  }
}
// listOrderCancel
module.exports.listOrderCancel = async (req, res) => {
  try {
    var listOrderCanel = [];
    // lay ra danh sach don hang cua ng dung 
    const tokenUser = req.cookies.tokenUser;
    const userId = await User.findOne({
      deleted: false,
      tokenUser: tokenUser,
    })
    const orders = await Order.find({
      'userInfo.userId': userId.id,
      status: "Đã hủy"
    });


    for (const order of orders) {
      let orderObj = order.toObject();
      orderObj.price = 0;
      const firstOrder = order.products[0];
      const firstOdrderImage = await Product.findOne({
        _id: firstOrder.productId,
        deleted: false,
      });
      orderObj.firstOdrderImage = firstOdrderImage.thumbnail;

      for (const element of order.products) {
        const info = await Product.findOne({
          _id: element.productId
        }).select(" price discountPercentage");
        const priceNew = ((1 - info.discountPercentage / 100) * info.price).toFixed(0);
        info.priceNew = priceNew;
        orderObj.price += Number(priceNew * element.quantity);
        orderObj.createdAtFormatted = formatDate(order.createdAt);
      }
      listOrderCanel.push(orderObj);

    }
    const user1 = await user.findOne({
      tokenUser: tokenUser,
    });
    res.json({
      orders: listOrderCanel,

    });

  } catch (error) {
    console.log("Lỗi khi lấy danh sách đơn hàng: ", error);
    return res.status(500).send("Internal Server Error");

  }
}

module.exports.detailOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
  }).select("products userInfo");

  var totalPrice = 0;
  for (const product of order.products) {
    const newPrice = product.price - (product.price * product.discountPercentage / 100).toFixed(0);
    totalPrice += Number(newPrice * product.quantity);

    // tim anh va title cua tung san pham
    const inforProduct = await Product.findOne({
      _id: product.productId
    }).select("thumbnail title slug");

    product.newPrice = newPrice;
    product.inforProduct = inforProduct;
  }
  order.totalPrice = totalPrice;
  res.render("client/pages/user/detailOrder.pug",
    {
      order: order
    }
  );


}
// Listorder   GET /user/order
// GET /user/edit/userId
module.exports.getInfor = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const user1 = await user.findOne({
      tokenUser: tokenUser,
    });

    res.render("client/pages/user/editInfo.pug", {
      user: user1,
      message: req.flash(),
    }

    );
  } catch (error) {
    console.log("Lỗi khi lấy thông tin người dùng: ", error);
    return res.status(500).send("Internal Server Error");

  }




}

// GET /user/edit/userId
//  POST /user/edit/userId start
module.exports.editInfor = async (req, res) => {
  try {
    await User.updateOne({
      _id: req.params.userId,
      deleted: false,
    }, req.body);


    req.flash("success", "Cập nhật thông tin thành công!");
    res.redirect("back");

  } catch (error) {
    req.flash("error", "Cập nhật thông tin không thành công!");
    console.log("Lỗi khi cập nhật thông tin người dùng: ", error);
    return res.status(500).send("Internal Server Error");

  }




}

// POST /user/edit/userId end 

//GET  forgotPassword start 
module.exports.forgotPassword = async (req, res) => {
  try {
    res.render("client/pages/user/forgot-password.pug");

  } catch (error) {
    console.log("Lỗi khi truy cập trang quên mật khẩu: ", error);
    return res.status(500).send("Internal Server Error");

  }

}

// get forgotPassword end
// POST forgotPasswordPost
module.exports.forgotPasswordPost = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = generateHelper.generateRandomNumber(4);
    const User = await user.findOne({
      email: email,
      deleted: false,
    });
    if (!User) {
      console.log("ko to tai user");

      // req.flash("error", "Tai khoan khong ton tai");
      return res.redirect("back");


    }
    // tao ra forgotPass
    const forgotPass = new forgotPassword({
      email: email,
      otp: otp,
      expireAt: Date.now() + 3 * 60 * 1000
    });
    await forgotPass.save();

    // gui mail
    const subject = "Mã OTP lấy lại mật khẩu";
    const htmlSendMail = `Mã OTP xác thực của bạn là <b style="color: pink;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác.`;
    // Gui ma otp qua email cua user
    sendEmailHelper.sendMail(email, subject, htmlSendMail);

    res.redirect("/user/password/otp?email=" + email);

  } catch (error) {
    console.log("Lỗi khi xử lý yêu cầu quên mật khẩu: ", error);
    return res.status(500).send("Internal Server Error");

  }

}
//POST forgotPasswordPost


//GET otpPassword start
module.exports.otpPassword = async (req, res) => {
  try {
    res.render("client/pages/user/otp-password.pug", {
      email: req.query.email
    });
  } catch (error) {
    console.log("Lỗi khi truy cập trang OTP: ", error);
    return res.status(500).send("Internal Server Error");

  }

}

// GET otpPassword start


// POST otpPassword start
module.exports.otpPasswordPost = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const forgotPass = await forgotPassword.findOne({
      email: email,
      otp: otp,
    });
    if (!forgotPass) {
      console.log("ma otp khong chinh xac");
      //   req.flash("error", "Mã OTP không chính xác");
      res.redirect("back");
    }
    res.redirect("/user/password/reset?email=" + email);


  } catch (error) {
    console.log("Lỗi khi xử lý yêu cầu OTP: ", error);
    return res.status(500).send("Internal Server Error");

  }

}

// POST otpPassword end

//GET resetPassword start
module.exports.resetPassword = async (req, res) => {
  try {
    const email = req.query.email;

    res.render("client/pages/user/new-password.pug", {
      email: email,
    });
  } catch (error) {
    console.log("Lỗi khi truy cập trang đặt lại mật khẩu: ", error);
    return res.status(500).send("Internal Server Error");

  }

}

// GET resetPassword end
// POST resetPasswordPost start
module.exports.resetPasswordPost = async (req, res) => {
  try {
    const email = req.body.email;

    const password = req.body.password;
    console.log(email);
    console.log(password);
    await User.updateOne({
      email: email,
    }, {
      $set: {
        password: md5(password),
      }
    });
    await forgotPassword.deleteMany({
      email: email,
    });
    console.log("thay doi mat khau thanh cong");
    // req.flash("success", "Thay doi mat khau thanh cong");
    res.redirect("/products");

  } catch (error) {
    console.log("Lỗi khi xử lý yêu cầu đặt lại mật khẩu: ", error);
    return res.status(500).send("Internal Server Error");
  }

}

// POST resetPasswordPost end