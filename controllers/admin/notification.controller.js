module.exports.index = async( req , res)=>{
try {
  res.render("admin/pages/notifications/index.pug");
  
} catch (error) {
  console.log("Error in admin notification index: ", error);
  res.status(500).send("Internal Server Error");
  return;
  
}

  
  }