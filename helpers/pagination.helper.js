const Order = require("../model/order.model");
const Products  = require("../model/products.model");

module.exports = async(req , find , type , lengthProCate= 0)=>{
var pagination = {
  currentPage: 1 , 
  limitItem: 24
} ; 


if( req.query.page){
  pagination.currentPage = parseInt(req.query.page);
}

pagination.skip = (pagination.currentPage- 1) * pagination.limitItem;
if( type ==="products"){
  const countProducts = await Products.countDocuments(find);

pagination.totalPage = Math.ceil(countProducts/pagination.limitItem);

}
else if( type ==="category"){
  if( lengthProCate != 0 ){
    const countProducts = lengthProCate ;
    pagination.totalPage = Math.ceil(countProducts/pagination.limitItem);

  }

}
else if( type ==="orders"){
console.log("vao orders");
const countOrders = await Order.countDocuments(find);
console.log(countOrders)
pagination.totalPage = Math.ceil(countOrders/pagination.limitItem);

}
return pagination 

}


