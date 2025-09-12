const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require("./model/user.model");
const Cart  = require("./model/cart.model");
const generateHelper = require("./helpers/generate.helper");
const RoomChat = require('./model/rooms-chats.model');
const chatController = require("./controllers/chat.controller");
const Role = require("./model/role.model");


passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.clientID, // Your Credentials here.
    clientSecret:process.env.clientSecret, // Your Credentials here.
    callbackURL: process.env.callbackURL,
    passReqToCallback:true
  },
  async function (req , res, accessToken, refreshToken, profile, done) {
    console.log("gooogleId" ,profile.id);
    try {
         let user = await User.findOne({
      googleId: profile.id 

    });

    if(!user){
      const cart = new Cart();
      await cart.save();
      const tokenUser = generateHelper.generateRandomString(30);

      user = await User.create({
        googleId: profile.id,
        email: profile.email,
        fullName: profile.displayName,
        tokenUser: tokenUser , 
        avatar: profile.picture , 
        cart_id: cart.id,

      })
      await user.save();

    }

    // console.log("accessToken" ,accessToken);

    // console.log("refresh" , refreshToken);
    
    return done(null, user);// user se co trong req.user
      
    } catch (error) {
      console.log("error" , error);

      
    }
 
  }
));