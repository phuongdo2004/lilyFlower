const  searchRouter = require("./search.router");
const homeRouter = require("./home.router");
const productRouter = require("./products.router");
const cartRouter = require("./cart.router");
const userRouter = require("./user.router");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const checkoutRouter  = require("./checkout.router");
const prepareBuysRouter = require("./checkout.router");
const Auth = require("../../middlewares/client/auth.middleware");
const chatSocket = require("../../socket/client/chat.socket");
const chatRouter = require("./chat.route");
const authRouter = require("./auth.router");
const responeRouter = require("./client.route");
const controllerPayment  = require("../../controllers/client/payment.controller");



module.exports.index= (app)=>{
  app.post("/checkout/callback", (req , res , next)=>{console.log("chayj vao middle"); next();
    
  } ,controllerPayment.paymentCallback);

  app.use("/home"  , homeRouter );
  app.use("/client" ,responeRouter );
  app.use(cartMiddleware.cartId); 
  
  app.use('/auth', authRouter);
  app.use(Auth.Auth);
  app.use("/search" ,searchRouter );
  app.use("/user" ,   userRouter)  
  app.use("/checkout" , checkoutRouter);
  app.use("/products" , productRouter);

  app.use("/cart", cartRouter);
  app.use("/chat" , chatRouter);


}