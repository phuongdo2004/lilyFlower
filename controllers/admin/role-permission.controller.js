const Role = require("../../model/role.model")

module.exports.index = async(req , res)=>{
  try {
    const listRole  = await  Role.find({
  deleted: false , 
})
const listLable = [
  {
    title: "Danh sách sản phẩm" , 
    role: [{
      title:"Xem" , 
      data:"products-view" ,
    } , {
    title:"Thêm mới"  ,
    data:"products-create"
    
  } ,
  {
    title:"Chỉnh sửa"  ,
    data:"products-edit"
    
  }  , 
  {
    title:"Xóa"  ,
    data:"products-deleted"
    
  } 


]
  } , 
  

  {
    title: "Danh sách sản phẩm" , 
    role: [{
      title:"Xem" , 
      data:"products-view" ,
    } , {
    title:"Thêm mới"  ,
    data:"products-create"
    
  } ,
  {
    title:"Chỉnh sửa"  ,
    data:"products-edit"
    
  }  , 
  {
    title:"Xóa"  ,
    data:"products-deleted"
  } 
]
  } , 

  {
    title: "Danh sách danh mục" , 
    role: [{
      title:"Xem" , 
      data:"product-category-view" ,
    } , {
    title:"Thêm mới"  ,
    data:"product-category-create"
    
  } ,
  {
    title:"Chỉnh sửa"  ,
    data:"product-category-edit"
    
  }  , 
  {
    title:"Xóa"  ,
    data:"product-category-deleted"
    
  } 


]
  } , 

  {
    title: "Nhóm quyền" , 
    role: [{
      title:"Xem" , 
      data:"roles-view" ,
    } , {
    title:"Thêm mới"  ,
    data:"roles-create"
    
  } ,
  {
    title:"Chỉnh sửa"  ,
    data:"roles-edit"
    
  }  , 
  {
    title:"Xóa"  ,
    data:"roles-deleted"
    
  } 


]
  } , 
  {
    title: "Phân quyền" , 
    role: [{
      title:"Xem" , 
      data:"permission-view" ,
    } , {
    title:"Thêm mới"  ,
    data:"permission-create"
    
  } ,
  {
    title:"Chỉnh sửa"  ,
    data:"permission-edit"
    
  }  , 
  {
    title:"Xóa"  ,
    data:"permission-deleted"
    
  } 


]
  } ,
  

  {
    title: "Tài khoản admin" , 
    role: [{
      title:"Xem" , 
      data:"account-view" ,
    } , {
    title:"Thêm mới"  ,
    data:"account-create"
    
  } ,
  {
    title:"Chỉnh sửa"  ,
    data:"account-edit"
    
  }  , 
  {
    title:"Xóa"  ,
    data:"account-deleted"
    
  } 


]
  }
]

console.log(listRole);
res.render("admin/pages/roles/role-permission.pug" , {
hello :"iii" ,
listRole : listRole , 
listLable: listLable ,  
}) 
     
  } catch (error) {
    console.log("Error in admin role-permission index: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }


}
module.exports.update = async( req , res)=>{
try {
   const arr = req.body;
  for (const element of arr) {
    console.log("ele"  , element)
    await Role.updateOne({
      _id: element.id,
    } , {
      permissions:element.permission
    });

    
  }
  req.flash("success" , "Cập nhật trạng thái thành công!");

  res.json({
    code: 200 , 
    
  })


} catch (error) {
  console.log("Error in admin role-permission update: ", error);
  res.status(500).send("Internal Server Error");
  return;
  
}
 
}
