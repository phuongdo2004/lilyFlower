const systemConfig = require("../../config/system.config");
const Account = require("../../model/accouns.model");
const Role = require("../../model/role.model");

// hàm này để bảo mật rằng ng dung có token đã đăng nhập trc đo

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
      // Kiểm tra nếu request đã đến trang login thì không redirect nữa
      if (req.path !== `/${systemConfig.prefixAdmin}/auth/login`) {
          return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
      }
      return next();
  }

  // Tìm tài khoản trong database
  const account = await Account.findOne({
      token: req.cookies.token,
      deleted: false,
  });


  // Nếu không tìm thấy tài khoản, tránh redirect lặp vô hạn
  if (!account) {
      if (req.path !== `/${systemConfig.prefixAdmin}/auth/login`) {
          return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
      }
      return next();
  }

  // Lưu tài khoản vào biến toàn cục
  res.locals.account = account;
//   --timm ng co role la sale
const roleSale = await Role.findOne({
    title:"sale" , 
    deleted: false ,
}).select("_id");

const sale  = await Account.findOne({
    role_id: roleSale.id , 
    deleted: false , 
    status : "active" ,
})

if( !sale){

    console.log("Chua co sale");
    return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}
else{
    res.cookie("idSale" , roleSale.id,  { path: '/admin' })
    res.cookie("tokenSale" , sale.token ,  { path: '/admin' })
}

  // Chuyển tiếp middleware
  next();
};
