const { generateRandomString } = require("../../helpers/generate.helper");
const Account = require("../../model/accouns.model");
const md5 = require("md5");
const systemConfig = require("../../config/system.config");
const Role = require("../../model/role.model");



module.exports.index = async(req , res)=>{  
//  render ra giao dien 
try {
  const accounts =await Account.find({
  deleted: false
}) 
for (const account of accounts) {
  const role = await Role.findOne({
    _id: account.role_id , 
    deleted: false
  }).select("title")

  account.role = role.title;
  
}

// req.flash("success" , "Thêm mới tài khoản thành công!");
res.render("admin/pages/accounts/index.pug" , {
  accounts : accounts,
  message: req.flash()
})
} catch (error) {
  console.log("Error in accounts index: ", error);
  res.status(500).send("Internal Server Error");
  return; 
  
}

  
}

// GET create account
module.exports.create = async(req , res)=>{
try {
   const roles = await Role.find({
    deleted: false ,
  })
  res.render("admin/pages/accounts/create" , 
    {
      message: req.flash()  , 
      roles :roles ,
    }
  );
} catch (error) {
  console.log("Error in create account: ", error);
  res.status(500).send("Internal Server Error");
  return;
  
}
 
}
// [POST] create account
module.exports.createPost = async(req , res)=>{
  try {
    req.body.password = md5(req.body.password);
req.body.token = generateRandomString(30);
const account = new Account(req.body);
await account.save();



req.flash("success" , "Thêm mới tài khoản thành công!");
// res.redirect(`/${systemConfig.prefixAdmin}/accounts`)

res.redirect("back");
  } catch (error) {
    console.log("Error in createPost account: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }

}
// [PATCH] change status start
module.exports.changeStatus= async( req  , res)=>{
  try {
    await Account.updateOne({
  _id: req.params.id ,

} , {
  status: req.params.status ,
});
req.flash("success" , "Cập nhật trạng thái tài khoản thành công!");
res.json({
  code: 200 ,
})

  } catch (error) {
    console.log("Error in changeStatus account: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }

}

//[PATCH] change status end 
// [GET] detail start
module.exports.detail = async( req , res)=>{
  try {
    const account = await Account.findOne({
    _id: req.params.id , 
    deleted: false ,
  })
  const role = await Role.findOne({
    _id: account.role_id , 
    deleted: false
  }).select("title")
  account.role = role.title
res.render("admin/pages/accounts/detail.pug" , {
  item: account , 
});

  } catch (error) {
    console.log("Error in detail account: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }
  

}
// [GET] detail end
// [GET] edit start
module.exports.edit = async( req , res)=>{
try {
  const item = await Account.findOne({
  _id: req.params.id ,
  deleted: false ,
}).select("-password");


const roles = await Role.find({
  deleted: false ,
})


res.render("admin/pages/accounts/edit" , {
  item : item , 
  roles: roles ,
  message: req.flash()
})

} catch (error) {
  console.log("Error in edit account: ", error);
  res.status(500).send("Internal Server Error");
  return; 
  
}

}
// [GET] edit end
// [POST] edit start
module.exports.editPost = async(req , res)=>{
  try {
    console.log(req.body);
console.log("id",req.params.id);
const acc  = await Account.findOne({
  _id: req.params.id , 

})
await Account.updateOne({
  _id: req.params.id , 
  
} ,req.body);
req.flash("success" , "Cập nhật tài khoản thành công!");

res.redirect("back");
  } catch (error) {
    console.log("Error in editPost account: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }



}

// [POST] edit end

// [PATCH] deleted start

module.exports.deleted = async( req  , res)=>{
  try {
    await Account.updateOne({
    _id: req.params.id , 
  
  } , {
    deleted: true ,
  });
  req.flash("deleted" , "Xóa tài khoản thành công!");
  res.json(
    {
      code :200 ,
    }
  )

  } catch (error) {
    console.log("Error in deleted account: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }
  

}

// [PATCH] deleted end
