const Products = require("../../model/products.model");
const Category = require("../../model/products-category.model.");
const paginationHelper = require("../../helpers/pagination.helper");
const chatSocket = require("../../socket/client/chat.socket");
const getSub = require("../../helpers/getCategory.helpers")
module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: false
    }
    const pagination = await paginationHelper(req, find, "products");
    const pro = await Products
      .find(find)
      .limit(pagination.limitItem)
      .skip(pagination.skip)
      .sort({
        position: "desc"
      })

    for (const item of pro) {
      item.priceNew = (Number(((1 - item.discountPercentage / 100) * item.price).toFixed(0)));
    }
    const ParentCategory = await Category.find({
      parent_id: "",
      status: "active",
    }).select("title");
    let categories = [];

    if (ParentCategory.length > 0) {
      for (const item of ParentCategory) {
        item.subCategories = await Category.find({
          parent_id: item._id,
          deleted: false,
          status: "active",
        }).select("title")
      }

    }
    res.render("client/pages/products/products.pug", {
      products: pro,
      message: req.flash(),
      pagination: pagination,
      categories: categories,
      ParentCategory: ParentCategory

    });

  } catch (error) {
    console.log("Error in products index: ", error);
    res.status(500).send("Internal Server Error");

  }

}


// [GET detail]
module.exports.detail = async (req, res) => {
  {
    try {
      const slug = req.params.slug;
      const product = await Products.findOne({
        slug: slug,
        status: "active",
      });
      product.priceNew = ((1 - product.discountPercentage / 100) * product.price).toFixed(0);

      if (product) {
        product.category = (await Category.findOne({
          _id: product.product_category_id
        }).select("title")).title;

        res.render("client/pages/products/detail", {
          pageTitle: "Chi tiết sản phẩm",
          item: product,
          message: req.flash()

        })
      } else {
        res.redirect(`/products`);

      }

    } catch (error) {
      console.log("ko thay");
      res.redirect(`/products`);
    }
  }
}

// [GET category]
module.exports.category = async (req, res) => {
  try {
    const categoryId = req.params.CategoryId;
    const titleCate = await Category.findOne({
      _id: categoryId, 
      deleted: false
    }).select("title -_id");
    var ListCate = [];
    ListCate = await getSub.getSubCate(categoryId, []);
    var ArrProduct = [];
    const find ={
      deleted : false ,
      product_category_id:{ $in: ListCate}
    }
    const pagination = await paginationHelper(req, find , "products")
    ArrProduct = await Products
      .find(find)
      .limit(pagination.limitItem)
      .skip(pagination.skip)
    
      for (const item of ArrProduct) {
      item.priceNew = Number(((1 - item.discountPercentage / 100) * item.price).toFixed(0));
    }


    const ParentCategory = await Category.find({
      parent_id: "",
      status: "active",
    }).select("title");

    if (ParentCategory.length > 0) {
      for (const item of ParentCategory) {
        item.subCategories = await Category.find({
          parent_id: item._id,
          deleted: false,
          status: "active",
        }).select("title")
      }
    }

    res.render("client/pages/products/category.pug", {
      products: ArrProduct,
      message: req.flash(),
      pagination: pagination,
      ParentCategory: ParentCategory,
      titleCate:  titleCate.title

    });
  } catch (error) {
    console.log("ko thay");
    res.redirect(`/products`);
  }
};