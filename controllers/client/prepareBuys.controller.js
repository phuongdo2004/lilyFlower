const {
  json
} = require("express");
const Buys = require("../../model/buys.model");
const Cart = require("../../model/cart.model");
const Order = require("../../model/order.model");
const Product = require("../../model/products.model");
const user = require("../../model/user.model");

module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartIdFlower;
    const cart = await Cart.findOne({
      _id: cartId
    }).select("products")


    cart.totalPrice = 0;

    for (const item of cart.products) {
      if (item.choosen == true) {
        {
          const productInfo = await Product.findOne({
            _id: item.productId,
          }).select("title , thumbnail  , slug , price , discountPercentage");
          productInfo.priceNew = (1 - productInfo.discountPercentage / 100) * productInfo.price;

          item.productInfor = productInfo;

          item.totalPrice = Number((productInfo.priceNew * item.quantity).toFixed(0));
          cart.totalPrice += item.totalPrice;
        }
      }

    }
    cart.totalPrice = Number(cart.totalPrice.toFixed(0));
    const fullName = req.query.fullName || "";
    const phone = req.query.phone || "";
    const address = req.query.address || "";
    res.render("client/pages/checkout/index.pug", {
      cart,
      fullName,
      phone,
      address,
      message: req.flash()

    });
  } catch (error) {
    console.log("Error in prepareBuys index: ", error);
    res.status(500).send("Internal Server Error");

  }


}
module.exports.changeAddress = async (req, res) => {
  try {
    const fullName = encodeURIComponent(req.body.fullName);
    const phone = encodeURIComponent(req.body.phone);
    const PaAddress = encodeURIComponent(req.body.address);
    const subAddress = encodeURIComponent(req.body.subAddress);
    const address = `${PaAddress} / ${subAddress}`;

    req.flash("success_order", "Đơn hàng đã được thêm vào!"); // Flash message
    res.redirect(`/checkout?fullName=${fullName}&address=${address}&phone=${phone}`);
  } catch (error) {
    console.log("Error in changeAddress: ", error);
    res.status(500).send("Internal Server Error");

  }

};

//  POST /checkout/order start
module.exports.order = async (req, res) => {
  try {
    const phone = req.body.phone;
    const address = req.body.address;
    const userId = req.cookies.tokenUser;
    const fullName = req.body.fullName;
    var products = [];
    const cartIdFlower = req.cookies.cartIdFlower;
    const cart = await Cart.findOne({
      _id: cartIdFlower
    });
    // lay ra danh sach cac san pham co  choosen  = true
    products = cart.products.filter(item => item.choosen == true);
    // lay ra discout  , price cua tung san pham
    var productOrder = []
    for (const item of products) {
      const productInfor = await Product.findOne({
        _id: item.productId,
      }).select("discountPercentage price")
      productOrder.push({
        productId: item.productId,
        quantity: item.quantity,
        discountPercentage: productInfor.discountPercentage,
        price: productInfor.price
      })
    }
    if (productOrder.length > 0) {
      const userOrder = await user.findOne({
        tokenUser: req.cookies.tokenUser,
      });
      const infor = {
        fullName: fullName,
        phone: phone,
        address: address,
        userId: userOrder._id,
      };
      const dataOrder = {
        userInfo: infor,
        products: productOrder
      }
      const newOrder = new Order(dataOrder);
      await newOrder.save();
      const productsList = await Product.find({
        deleted: false,
      }).lean();
      for (const item of productsList) {
        item["priceNew"] = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);

      }


      res.json({
        code: 200,
        products: productsList


      });
    } else {
      console.log("luu don hang that bai");

    }

  } catch (error) {
    console.log("Error in order: ", error);
    res.status(500).send("Internal Server Error");

  }
  // luu dia chi thong tin vao database order   const fullName = req.body.fullName;

}

//  POST /checkout/order end
//  GET /checkout/order/success start

module.exports.success = async (req, res) => {
  try {
    let listProducts = [];
    if (req.query.products) {
      try {
        listProducts = JSON.parse(req.query.products); // chuyen lai thanh mang

      } catch (error) {
        console.log("Loi parse Json: ", error)
      }
    }
    res.render("client/pages/checkout/success", {
      products: listProducts
    })


  } catch (error) {
    console.log("Error in success: ", error);
    res.status(500).send("Internal Server Error");

  }
}
//  GET /checkout/order/success end

//POST saveChoose start
module.exports.saveChoosen = async (req, res) => {
  const data = req.body;
  const cartId = req.cookies.cartIdFlower;
  const cart = await Cart.findOne({
    _id: cartId,
  })


  const a = data.arrId
  a.forEach(async (id) => {
    // cap nhat choose cua san pham co id la true
    await Cart.updateOne({
      _id: cart._id,
      'products.productId': id
    }, {
      $set: {
        'products.$.choosen': true
      }

    })

  })
  const b = data.arrFalse;
  b.forEach(async (id) => {
    await Cart.updateOne({
      _id: cart._id,
      'products.productId': id
    }, {
      $set: {
        'products.$.choosen': false
      }
    })

  })
  res.json({
    code: 200,

  })

}

// POST saveChoose end
