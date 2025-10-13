const systemConfig = require("../../config/system.config");
const createTreeHelper = require("../../helpers/createTree.helpers");
const Category = require("../../model/products-category.model.");
module.exports.index = async (req, res) => {
  try {
    const productCategory = await Category.find({
      deleted: false
    });
    res.render("admin/pages/product-category/index.pug", {
      productCategory: productCategory,
      message: req.flash()
    });

  } catch (error) {
    console.log("Error in product category index: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }



}
module.exports.create = async (req, res) => {
  try {

    const categories = await Category.find({
      deleted: false
    });
    const newCategories = createTreeHelper.index(categories);
    res.render("admin/pages/product-category/create.pug", {
      categories: newCategories,
    });


  } catch (error) {
    console.log("Error in product category create: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }


}
module.exports.createPost = async (req, res) => {
  try {
    if (!req.body.position) {
      req.body.position = await Category.countDocuments({}) + 1;


    }
    const newCate = new Category(req.body);
    await newCate.save();

    req.flash("success", "Thêm mới danh mục thành công!");

    res.redirect(`/${systemConfig.prefixAdmin}/product-category`)
  } catch (error) {
    console.log("Error in product category createPost: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }

}


// [PATCH] changePositon start
module.exports.changePositon = async (req, res) => {
  try {
    await Category.updateOne({
      _id: req.params.id,
    }, {
      position: req.body.position,
    })
    req.flash("success", "Cập nhật vị trí thành công!");

    res.json({
      code: 200
    })
  } catch (error) {
    console.log("Error in changePosition: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }



}
// [PATCH] changePosition end


// [PATCH] change status
module.exports.changeStatus = async (req, res) => {
  try {

    if (req.params.status == "inactive") {
      await Category.updateOne({
        _id: req.params.id,
        deleted: false
      }, {
        status: "inactive",
      })
    } else if (req.params.status == "active") {
      await Category.updateOne({
        _id: req.params.id,
        deleted: false
      }, {
        status: "active",
      })
    }
    req.flash("success", "Cập nhật trạng thái danh mục thành công!");
    res.json({
      code: 200
    });

  } catch (error) {
    console.log("Error in changeStatus: ", error);
    res.status(500).send("Internal Server Error");
    return;
  }


}
// [PATCH] change status
// [get]  detail product
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({
      _id: id,
      deleted: false
    });
    if (category.parent_id) {
      const pa = await Category.findOne({
        _id: category.parent_id,
        deleted: false,
      }).select("title")
      category.parent = pa.title;

    } else {
      category.parent = "Danh mục tổng"
    }



    res.render("admin/pages/product-category/detail.pug", {
      item: category,

    })


  } catch (error) {
    console.log("Error in detail product category: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }

}

// [get] detail product
// [GET] Editor
module.exports.edit = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,

    });
    if (category.parent_id) {
      const PaCategory = await Category.findOne({
        _id: category.parent_id,
      });



      category.PaCategory = PaCategory.title;
    } else {
      category.PaCategory = "";


    }

    const categories = await Category.find({
      deleted: false
    });

    const newCategories = createTreeHelper.index(categories);
    res.render("admin/pages/product-category/edit.pug", {
      item: category,
      categories: newCategories,
      message: req.flash(),
    })
  } catch (error) {
    console.log("Error in edit product category: ", error);
    res.status(500).send("Internal Server Error");
    return;
  }




}


// [GET] edit
// [PATCH] edit 
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    // vi cac ythong tn trrar ve deu o dang chuoi nen phai chuyen ve so 
    console.log(req.body);
    console.log(req.body.position);


    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const cnt = await Category.countDocuments({
        deleted: false
      });
      req.body.position = cnt + 1;
    }
    console.log(req.body.position);

    await Category.updateOne({
      _id: id,

    },
      req.body
    );
    req.flash("success", "Cập nhật sản phẩm thành công");;
    res.redirect("back");


  } catch (error) {
    console.log("Error in editPatch product category: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }

}


// [PATCH] edit

// [patch] delete start
module.exports.deleted = async (req, res) => {
  try {
    const id = req.params.id;
    await Category.updateOne({
      _id: id,

    }, {
      deleted: true
    })
    req.flash("error", "Xóa danh mục thành công!");
    res.json({
      code: 200
    })
  } catch (error) {
    console.log("Error in deleted product category: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }


}

// [PATCH] delete