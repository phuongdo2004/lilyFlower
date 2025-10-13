const systemConfig = require("../../config/system.config");
const Role = require("../../model/role.model");

module.exports.index = async (req, res) => {
  try {
    const roles = await Role.find({
      deleted: false,
    })


    res.render("admin/pages/roles/index.pug", {
      roles: roles,
      message: req.flash(),

    });

  } catch (error) {
    console.log("Error in roles index: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }


}
module.exports.create = async (req, res) => {
  try {
    res.render("admin/pages/accounts/create.pug");
  } catch (error) {
    console.log("Error in create role: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }

}
module.exports.create = async (req, res) => {
  try {
    res.render("admin/pages/roles/create.pug");
  } catch (error) {
    console.log("Error in create role: ", error);
    res.status(500).send("Internal Server Error");
    return;
  }


}
module.exports.createPost = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();

    req.flash("success", "Thêm mới nhóm quyền");


    res.redirect(`/${systemConfig.prefixAdmin}/roles`);

  } catch (error) {
    console.log("Error in create role post: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }


}
// DETAIL
module.exports.detail = async (req, res) => {
  try {
    const item = await Role.findOne({
      _id: req.params.id,
      deleted: false
    });
    res.render("admin/pages/roles/detail.pug", {
      item: item,
      message: req.flash(),

    });
  } catch (error) {
    console.log("Error in role detail: ", error);
    res.status(500).send("Internal Server Error");
    return;

  }




}
// DETAIL
// [GET] edit 
module.exports.edit = async (req, res) => {
  try {
    const item = await Role.findOne({
      _id: req.params.id,
      deleted: false
    });
    res.render("admin/pages/roles/edit.pug", {
      item: item,
      message: req.flash(),
    })
  } catch (error) {
    console.log("Error in edit role: ", error);
    res.status(500).send("Internal Server Error");
    return;
  }

}


// [GET] edit end

// [post] edit start
module.exports.editPost = async (req, res) => {
  try {
    await Role.updateOne({
      _id: req.params.id,
      deleted: false
    }, req.body);
    req.flash("success", "Chỉnh sửa nhóm quyền thành công!");

    res.redirect("back");
  } catch (error) {
    console.log("Error in edit role post: ", error);
    res.status(500).send("Internal Server Error");
    return;
  }

}

// [post] edit end
// [PATCH] deleted start
module.exports.deleted = async (req, res) => {
  try {
    await Role.updateOne({
      _id: req.params.id,

    }, {
      deleted: true,
    });


    req.flash("deleted", "Xóa sản phẩm thành công!");

    res.json(
      {
        code: 200,
      }
    )
  } catch (error) {
    console.log("Error in role deleted: ", error);
    res.status(500).send("Internal Server Error");
    return;
  }
}


// [PATCH] deleted end