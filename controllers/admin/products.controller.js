const systemConfig = require("../../config/system.config");
const Account = require("../../model/accouns.model");
const Products = require("../../model/products.model");
const paginationHelper = require("../../helpers/pagination.helper");
const Category = require("../../model/products-category.model.");
const createTreeHelper =require("../../helpers/createTree.helpers");


const moment = require("moment");
const Product = require("../../model/products.model");
const ProductCategory = require("../../model/products-category.model.");

module.exports.index = async (req, res) => {
  try {
    const find = {
    deleted: false
  }

  //  loc ttrang thai 
  if (req.query.status) {
    find.status = req.query.status
  }
  //  sap xep nhieu 
  const sort = {
  
  }
  if( req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;

  }else{
    sort["position"] = "desc";
    
  }
  //  phan trang 
  const pagination = await paginationHelper(req, find , "products");

  const products = await Product
    .find(find)
    //  gioi han s luong opphan tu in ra trong moi trang 
    .limit(pagination.limitItem)
    // bo qua bao nhieu phan tu 
    .skip(pagination.skip)
    .sort(sort);


  products.forEach(async (item) => {
    item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
    // console.log(item.createdAtFormat);
    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    const hello = await Account.findOne({
      _id: item.updatedBy
    })


  });

  // console.log("flash" ,req.flash());
// message={
// "h1":"rong"
// }
// message = req.flash();
// console.log("message" , message);
  res.render("admin/pages/products/index.pug", {
    products: products,
    message : req.flash(),
    pagination: pagination,

  });

    
  } catch (error) {
    console.log("Error in products index: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }
  
}

module.exports.create = async (req, res) => {
try {
  const categories = await Category.find({deleted:false});
// console.log(categories);

const newCategories = createTreeHelper.index(categories);
// console.log(newCategories);

  res.render("admin/pages/products/create", {
    message: req.flash() , 
    categories: newCategories,

   
  })

} catch (error) {
  console.log("Error in create product: ", error);
  res.status(500).send("Internal Server Error");
  return;
  
}



}
module.exports.addPost = async (req, res) => {
  try {
    console.log(req.body);
console.log("pha tao ")
  if (!req.body.position) {
    req.body.position = await Products.countDocuments({}) + 1;
  }
  const pro = new Products(req.body);
  await pro.save();
  req.flash("success", "Thêm mới sản phẩm thành công!");
  res.redirect(`/${systemConfig.prefixAdmin}/products/add`);

  } catch (error) {
    console.log("Error in addPost product: ", error);
   
    res.redirect(`/${systemConfig.prefixAdmin}/products/add`);
    return;
    
  }


}
// change_MUlti start

module.exports.changeMulti = async (req, res) => {
  try {

    const value = req.body.value;
    const ids = req.body.ids;


    switch (value) {
      case "active":
      case "inactive":

        await Products.updateMany({
          _id: ids
          }, {
          status: value
      });
        break;
      case "delete":
        await Products.updateMany({
          _id: ids
        }, {
          deleted: true
        })
        break;
      default:
        break;
    }
    res.json({
      code: 200
    });
  } catch (error) {
    req.flash("error", "thong bao loi");
  }


}

// change_MUlti end

// change Status start

module.exports.changeStatus = async( req ,res)=>{
try {
  const id = req.params.id;
const status = req.params.status ;

await Products.updateOne({
  _id: id 
} , {
  status:  status

});


res.json({code :200});


} catch (error) {
  console.log("Error in changeStatus: ", error);
  res.status(500).send("Internal Server Error");
  return;
}

}


//   change status end 
// [GET]detail
//  detail start

module.exports.detail = async( req , res)=>{
  try {
    const id = req.params.id;
const product = await Products.findOne({
  _id: id , 
});


const priceNew =  ((1-product.discountPercentage/100)*product.price).toFixed(0);
product.priceNew = priceNew;
const category = await Category.findOne({
  _id: product.product_category_id ,
});

product.category  = category.title;

res.render("admin/pages/products/detail" , {
  item: product
});
  } catch (error) {
    console.log("Error in product detail: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }
}

// detail end

// edit product start


module.exports.edit = async( req , res)=>{
try {


  const product = await Products.findOne({
  _id: req.params.id ,
  deleted: false,
});
const category = await Category.findOne({
  _id: product.product_category_id ,
});


product.category  = category.title;
const categories = await Category.find({deleted:false});
const newCategories = createTreeHelper.index(categories);
res.render("admin/pages/products/edit.pug" , {
  item : product , 
  categories: newCategories,
  message: req.flash() ,
})

} catch (error) {
  console.log("Error in edit product: ", error);
  res.status(500).send("Internal Server Error");
  return;
}


}

//  edit product end


// [PATCH] edit start

module.exports.editPatch = async( req , res)=>{
  try {
    console.log(req.body);
const id = req.params.id;
// vi cac ythong tn trrar ve deu o dang chuoi nen phai chuyen ve so 
req.body.price =parseInt(req.body.price);
req.body.discountPercentage =parseInt(req.body.discountPercentage);
req.body.stock = parseInt(req.body.stock);



if( req.body.position){
    req.body.position = parseInt(req.body.position);
}else{
    const cnt = await Products.countDocuments({deleted:false});
    req.body.position = cnt +1;
}
req.body.status =req.body.status;
req.body.stock  = parseInt(req.body.stock);
req.body.updatedBy = res.locals.account.id;
await Product.updateOne({
  _id: id
} , req.body);
req.flash("success" , "Cập nhật sản phẩm thành công");;
res.redirect("back");

    
  } catch (error) {
    console.log("Error in editPatch product: ", error);
    res.status(500).send("Internal Server Error");
    return;
    
  }
}


// [PATCH] edit end


// [Patch] delete start
module.exports.deleted = async (req , res)=>{
try {
  console.log(req.params.id);
await Product.updateOne({
  _id:req.params.id 
} , {
  deleted: true,
})
req.flash("success" , "Xóa sản phẩm thành công");

res.json({
  code: 200
})

} catch (error) {
  console.log("Error in deleted product: ", error);
  res.status(500).send("Internal Server Error");
  return;
  
}

}

// [Patch] delete end

// [PATCH] changePositon start
module.exports.changePositon = async( req , res)=>{
try {
   console.log(req.params.id);
  await Product.updateOne({
    _id: req.params.id , 
  } , {
    position:req.body.position ,
  })
  req.flash("success" , "Cập nhật vị trí thành công!");
   
res.json({
  code :200
})
} catch (error) {
  console.log("Error in changePosition: ", error);
  res.status(500).send("Internal Server Error");
  return; 
}
}
// [PATCH] changePosition end