const respone = require("../../model/respone.model");
const Products = require("../../model/products.model");

module.exports.sendMessage = async(req  , res)=>{

 try {
  const responeClient = new respone(req.body);
  await responeClient.save();
  req.flash("success" , "Cảm ơn bạn đã phản hồi!");
res.redirect("/home");
  } catch (error) {
    console.log("Error in home controller index: ", error);
    res.status(500).send("Internal Server Error");  
    
  }
}