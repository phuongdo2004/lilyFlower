const Order = require("../../model/order.model");
const Products = require("../../model/products.model");
const paginaion = require("../../helpers/pagination.helper");

module.exports.index = async (req, res) => {
  const find = {

  }
  const paginationOrder = await paginaion(req, find, "orders");
  const orders = await Order
    .find(find)
    .skip(paginationOrder.skip)
    .limit(paginationOrder.limitItem);

  // Lay anh cua san pham dau tien trong don hang
  for (const element of orders) {
    const firstOrder = element.products[0];

    const firstPro = await Products.findOne({
      _id: firstOrder.productId,
    }).select("title thumbnail price discountPercentage");

    element.title = firstPro.title;
    element.thumbnail = firstPro.thumbnail;
    // tinh toong tien 
    var totalPrice = 0;
    for (const item of element.products) {
      totalPrice += ((1 - item.discountPercentage / 100) * item.price) * item.quantity;

    }
    element.totalPrice = totalPrice;
  }
  res.render("admin/pages/orders/index.pug", {
    orders: orders,
    pagination: paginationOrder,
    message: req.flash(),


  });


}
module.exports.detail = async (req, res) => {
  var totalPriceOrder = 0;
  const id = req.params.id;
  const order = await Order.findOne({
    _id: id
  });

  var products = order.products;
  products = await Promise.all(products.map(async (item) => {
    const productInfo = await Products.findOne({
      _id: item.productId
    });
    item.productInfo = productInfo;
    const newPrice = Number(((1 - item.discountPercentage / 100) * item.price).toFixed(0));
    const totalPriceProduct = item.quantity * newPrice;
    item.newPrice = newPrice;
    totalPriceOrder += Number(totalPriceProduct);
    item.totalPriceProduct = totalPriceProduct;
    return item;

  }))

  res.render("admin/pages/orders/detail.pug", {
    order: order,
    products: products,
    totalPriceOrder: totalPriceOrder.toFixed(0) , 
    message: req.flash(),

  });

}
module.exports.changeStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const status = req.body.status;
  await Order.updateOne({
    _id: orderId
  }, {
    status: status
  })
 // server
req.flash('success', 'Đặt hàng thành công');
// const flashes = {
//   success: req.flash('success'), // lấy mảng và sẽ xóa khỏi session
//   error: req.flash('error')
// };
// res.json({ code: 200, flashes});
res.redirect("/admin/orders");

}
module.exports.deletedOrder = async (req, res) => {
  const orderId = req.params.orderId;
  await Order.deleteOne({
    _id: orderId
  })
  res.json({
    code: 200,
    message: "Xóa đơn hàng thành công!",
  })
}