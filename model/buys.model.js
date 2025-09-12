const { default: mongoose } = require("mongoose");
const buySchema  = new mongoose.Schema({

  products:[
    {
      productId:String , 
      quantity: Number , 
      status: String , 
    }
  ]
} , {
  timestamps: true ,
  
})

const Buys= mongoose.model("Buys" , buySchema , "buys");
module.exports = Buys;




