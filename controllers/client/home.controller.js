const Products = require("../../model/products.model");
module.exports.index = async (req, res) => {
  try {
    const productsNew = await Products
      .find({
        status: "active",
        deleted: false
      })
      .sort({ position: "desc" })
      .limit(12)
      .select("-description");
    for (const item of productsNew) {
      item.priceNew = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);
    }


    res.render("client/pages/home/index", {
      productsNew: productsNew,
      message: req.flash(),
    });
  } catch (error) {
    console.log("Error in home controller index: ", error);
    res.status(500).send("Internal Server Error");

  }

}