const Chat = require("../model/chats.model.js");
const RoomChat = require("../model/rooms-chats.model.js");

module.exports.createRoomChat = async( req , res ,userId , userName  )=>{

const Sale = res.locals.sale;
console.log("sale" , Sale);

const idSale = Sale.id;

console.log("saleid", idSale);

const id = userId

const data = {
  title:{
    admin:"CSKH" ,
    client: userName ,
  } , 
  user:[
    {
      userId:id ,
    } , 
    {
      saleIds: idSale,
    }
  ] 


}
const roomChat = new RoomChat(data);
  await roomChat.save();
  console.log(roomChat.user[1]);
  console.log("Room chat created successfully.");


}

