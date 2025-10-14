const Chat = require("../model/chats.model.js");
const RoomChat = require("../model/rooms-chats.model.js");
const Account = require("../model/accouns.model.js");
const Role = require("../model/role.model.js");
module.exports.createRoomChat = async( req , res ,userId , userName  )=>{
  const roleSale = await Role.findOne({
      title: "sale",
      deleted: false,
    }).select("_id");

    const sale = await Account.findOne({
      role_id: roleSale.id,
      deleted: false,
      status: "active",
    }).select("_id fullName role_id");

// const Sale = res.locals.sale;
const idSale = sale.id;

console.log("saleid", idSale);

const id = userId

const data = {
  title:{
    admin:"CSKH" ,
    client: userName ,
  } , 
  user:[{
    
      userId:id ,
    
      saleId: idSale,
  }
   
  ] 


}
// console.log("dataroomChat" , data);
const roomChat = new RoomChat(data);
  await roomChat.save();
  
  console.log("Room chat created successfully.");


}

