const mongoose  = require("mongoose");
const orderSchema =  new mongoose.Schema({
userInfo:{
  userId: String,
  fullName : String , 
  phone : Number , 
  address:String
} ,
products:[
  {
    productId :String ,
    quantity: Number  ,
    discountPercentage: Number , 
    price:Number
  }
] , 
status:{
  type :  String , 
  enum: ['Chờ xác nhận', 'Đang xử lí', 'Đang vận chuyển', 'Đã hủy' , 'Trả lại' ,'Đã giao'],
  default:"Chờ xác nhận"
}, 
payment:{
  type: String , 
  default:"Chưa thanh toán"
}
} , {
  timestamps: true ,
});
const Order = mongoose.model("Order" , orderSchema , "orders");
module.exports = Order ;


