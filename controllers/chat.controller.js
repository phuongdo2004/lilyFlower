const Chat = require("../model/chats.model.js");
const RoomChat = require("../model/rooms-chats.model.js");

module.exports.createRoomChat = async( req , res ,userId , userName  )=>{
const Sale = res.locals.sale;
const idSale = Sale.id;

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

