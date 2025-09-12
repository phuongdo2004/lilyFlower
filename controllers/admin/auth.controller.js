const md5 = require("md5");
const Account = require("../../model/accouns.model");
const systemConfig = require("../../config/system.config");


module.exports.login = async (req, res) => {
  try {
    res.render("admin/pages/auth/login.pug", {
      message: req.flash()

    });
  } catch (error) {
    console.log("Error in login: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }



}

module.exports.loginPost = async (req, res) => {
  try {
    console.log(req.body);
    const password = md5(req.body.password);
    const account = await Account.findOne({
      fullName: req.body.fullName,

    });


    if (!account) {
      console.log("Tên đăng nhập không tồn tại!");

      req.flash("error", "Tên đăng nhập không tồn tại!");
      res.redirect("back");
      return;
    }
    console.log(md5(password));
    console.log(account.password);

    if (password != account.password) {
      console.log("smk")
      req.flash("error", "Sai mật khẩu!");
      res.redirect("back");
      return;
    }
    // check xem co hoat dong ko
    if (account.status != "active") {
      console.log("khoa");

      req.flash("error", "Tài khoản đã bị khóa!");
      res.redirect("back");
      return;

    }


    res.cookie("token", account.token, {
      path: '/admin'
    });
    // res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    req.flash("success", "Đăng nhập tài khoản thành công");
    // console.log("Flash trước redirect:", req.flash("error")); // Nên hiển thị message

    // res.redirect("back");
    // res.redirect(req.get("Referrer") || "/")
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);

  } catch (error) {
    console.log("Error in loginPost: ", error);
    res.status(500).send("Internal Server Error");
    return;
  }

}


module.exports.logout = async (req, res) => {
  try {
    res.render("admin/pages/auth/login.pug");
  } catch (error) {
    console.log("Error in logout: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }



}