const  Category =  require("../model/products-category.model.");
var getSubCate = async(categoryId , ArrCate)=>{
let SubCate = await Category.find({
    parent_id: categoryId

  });
  if( SubCate.length>0){
    for (const item of SubCate) {
     await getSubCate(item.id ,  ArrCate);
    }
  }
if( !ArrCate.includes(categoryId)){
  ArrCate.push(categoryId);
}

return  ArrCate;
}
module.exports.getSubCate  = getSubCate;
