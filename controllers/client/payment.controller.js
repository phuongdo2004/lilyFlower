const Order = require("../../model/order.model");
const Cart = require("../../model/cart.model");
const Product  = require("../../model/products.model");
const user  = require("../../model/user.model");
const config = require("../../config/system.config");
const axios  = require("axios");
const crypto = require("crypto");

module.exports.payment =  async (req, res) => {
// xu ly don hang (luu vao DB)
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
    var productOrder = [];
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
    // xoa cac san pham nay trong gio hang
    for (const product of products) {
      await Cart.updateOne({
        _id: cartIdFlower,
        'products.productId': product.productId
      }, {
        $set: {
          'products.$.choosen': false,
        }
      }
      )

    }
// xu ly don hang (luu vao DB) end
  let {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    // redirectUrl,
    // ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = config;
  const ipnUrl = process.env.ipnUrl;
  const redirectUrl = process.env.redirectUrl;
  console.log(ipnUrl);
  console.log(redirectUrl);
  var amount = (req.body.totalPrice + '').replace(/\./g, '');
  var orderId = newOrder._id.toString();
  console.log(amount);

  var requestId = orderId;

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType;

  //signature
  var signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  //json object send to MoMo endpoint

 const requestBodyObject = { // Đổi tên biến để rõ ràng hơn
    partnerCode: partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
    
    // THÊM HAI THUỘC TÍNH NÀY VÀO ĐỐI TƯỢNG GỐC
    ipnUrl: process.env.ipnUrl, 
    redirectUrl: process.env.redirectUrl,
  };

  const requestBody = JSON.stringify(requestBodyObject); // Chuyển đổi đối tượng sang JSON

  // options for axios
  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  // Send the request and handle the response
  let result;
  try {
    result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};
module.exports.paymentCallback = async(req  , res )=>{
  
  /**
    resultCode = 0: giao dịch thành công.
    resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
    resultCode <> 0: giao dịch thất bại.
   */
  console.log('callback: ');
  console.log(req.body);
  if( req.body.resultCode == 0){
    const orderId = req.body.orderId;
  await Order.updateOne({
    _id: orderId
  } , 
  {
    payment:"Đã thanh toán"
  })
  console.log("dax cap nhat thanh cong");
  }else{
    console.log("thanh toan that bai");
    
  }
  
  /**
   * Dựa vào kết quả này để update trạng thái đơn hàng
   * Kết quả log:
   * {
        partnerCode: 'MOMO',
        orderId: 'MOMO1712108682648',
        requestId: 'MOMO1712108682648',
        amount: 10000,
        orderInfo: 'pay with MoMo',
        orderType: 'momo_wallet',
        transId: 4014083433,
        resultCode: 0,
        message: 'Thành công.',
        payType: 'qr',
        responseTime: 1712108811069,
        extraData: '',
        signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
      }
   */

  return res.status(204).json(req.body);

}