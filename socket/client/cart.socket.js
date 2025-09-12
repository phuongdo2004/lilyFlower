const Cart = require("../../model/cart.model.js");

module.exports = async(req , res , cart) => {
  
  _io.once("connection", (socket) => {
    console.log("Kết nối socket thành công ben cart ");
    // BE nhan dl tu client 
    socket.on("CLIENT_SEND_PRICE" , data=>{

      // xu li du lieu 
      cart.totalPrice = 0;
      data.forEach(element => {
        cart.totalPrice+= parseInt(element);
      });

      // gui cho FE 
      socket.emit("SEVER_SEND_TOTALPRICE" ,{
        totalPrice: cart.totalPrice , 
        cartId: cart.id
      } )
    })
    socket.on("CLIENT_SEND_PRODUCTID_BUYS" , async(data)=>{
// nhung j nhan dc data luon o dang obj
     console.log(data);



const a  = data.arrId
a.forEach(async(id)=>{

  console.log(id);
  // cap nhat choose cua san pham co id la true
  await Cart.updateOne({
      _id:cart._id,
      'products.productId': id
  } , {
    $set: {
      'products.$.choosen': true
    }

  })

})
const b = data.arrFalse;
b.forEach(async(id)=>{
  console.log(id);
  await Cart.updateOne({
    _id: cart._id ,
    'products.productId': id
  } , {
   $set:{
    'products.$.choosen': false
   }
  })

})
    })
  });
};
