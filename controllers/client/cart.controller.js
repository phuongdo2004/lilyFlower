const { cartId } = require("../../middlewares/client/cart.middleware");
const Cart = require("../../model/cart.model");
const Product = require("../../model/products.model");
const cartSocket = require("../../socket/client/cart.socket.js");


module.exports.index = async (req, res, next) => {
  try {
    const cartId = req.cookies.cartIdFlower;
    const cart = await Cart.findOne({
      _id: cartId
    });
    // cartSocket(req , res , cart);
    cart.totalPrice = 0;

    if(cart.products.length > 0) {
      // ko dung forEach de tinh toan no se ko an vs totalPrice (==0day)=> phai dung for
      for (const product of cart.products) {
  
        const productInfo = await Product.findOne({
          _id:product.productId,
        }).select("thumbnail discountPercentage  price title slug ");
    
        productInfo.priceNew = Number(((1-productInfo.discountPercentage/100)*productInfo.price).toFixed(0));
        product.productInfor = productInfo;
        product.totalPrice =Number((productInfo.priceNew  * product.quantity).toFixed(0))
      }
    }
    message = req.flash();
  
  
    res.render("client/pages/cart/index", {
      pageTitle: "Giỏ hàng",
      cartDetail: cart , 
      // message: message.length > 0 ? message[0] :"hello",  // Đảm bảo không bị undefined
   
  
    });  
  } catch (error) {
    res.send("Lỗi khi lấy giỏ hàng: " + error.message);
  }
  
    
}

module.exports.addPost = async (req, res) => {
try {
  const quantity = parseInt(req.body.quantity);
  const productId = req.params.productId;
  const cartId = req.cookies.cartIdFlower
  const exitCart = await Cart.findOne({
    _id: cartId
  })
  if (exitCart) {
  const existProductInCart = exitCart.products.find(
    item => item.productId == productId
  );
  if (!existProductInCart) {
    await Cart.updateOne({
      _id: cartId,
    }, {
      $push: {
        products: {
          productId: productId,
          quantity: quantity,
        }
      }
    })
  } else {
    await Cart.updateOne({
      _id: cartId,
      'products.productId': productId,

    }, {
      $set: {
        "products.$.quantity": quantity + existProductInCart.quantity
      }
    })
  }
req.flash("success" , "Đã thêm vào giỏ hàng" )
  res.redirect("back");
}

  
} catch (error) {
  console.log("Error in addPost: ", error);
  res.status(500).send("Internal Server Error");  
  
}
  
}
module.exports.addPost2 = async (req, res) => {
try {
   const quantity = parseInt(req.body.quantity);
  const productId = req.params.productId;
  const cartId = req.cookies.cartIdFlower


  const exitCart = await Cart.findOne({
    _id: cartId
  }).select("products")
  if (exitCart) {

  const existProductInCart = exitCart.products.find(
    item => item.productId == productId
  );
  if (!existProductInCart) {
    await Cart.updateOne({
      _id: cartId,

    }, {
      $push: {
        products: {
          productId: productId,
          quantity: quantity,
          choosen : true
        }
      }
    })
  } else {
    await Cart.updateOne({
      _id: cartId,
      'products.productId': productId,

    }, {
      $set: {
        choosen : true ,
        "products.$.quantity": quantity + existProductInCart.quantity
      }
    })


  }


}

  
const cart = await Cart.findOne({
  _id: cartId
});


cart.totalPrice = 0;

if(cart.products.length > 0) {
  // ko dung forEach de tinh toan no se ko an vs totalPrice (==0day)=> phai dung for
  for (const product of cart.products) {
    const productInfo = await Product.findOne({
      _id:product.productId,
    }).select("thumbnail discountPercentage  price title lug ");
    productInfo.priceNew = (1-productInfo.discountPercentage/100)*productInfo.price;

    product.productInfor = productInfo;

    product.totalPrice =productInfo.priceNew  * product.quantity;
        cart.totalPrice+= product.totalPrice;
  }
}


res.redirect('/cart');
} catch (error) {
  console.log("Error in addPost2: ", error);
  res.status(500).send("Internal Server Error");
}
 

}



// delete product in cart 
module.exports.delete = async (req, res) => {
try {
  const productId = req.params.productId;
  const cartId = req.cookies.cartIdFlower;

  await Cart.updateOne({
  
    _id: cartId,
  }, {
    $pull: {
      products: {
        productId: productId
      }
    }
  })
  
  res.redirect("back");
} catch (error) {
  console.log("Error in delete: ", error);
  res.status(500).send("Internal Server Error");
  
}
 
}

// end delete product in cart

// update quantity start
module.exports.updateQuantity  = async(req ,  res)=>{
try {
  const productId = req.params.productId;
const quantity= req.params.quantity;
const cartId = req.cookies.cartIdFlower ; 

await Cart.updateOne({
  _id: cartId,
  'products.productId': productId,

}, {
  $set: {
    "products.$.quantity": quantity ,
  }
})
} catch (error) {
  console.log("Error in updateQuantity: ", error);
  res.status(500).send("Internal Server Error");
  
}
res.redirect("back");



} 



// update quantity  end