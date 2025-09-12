const express  = require("express")
const router = express.Router();
const passport = require('passport');
require("../../passport");
const RoomChat = require("../../model/rooms-chats.model");
const Role = require("../../model/role.model");
const Account = require("../../model/accouns.model");
const chatController = require("../../controllers/chat.controller");
const AuthController  = require("../../controllers/client/authGoogle.controller");

router.get('/', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));

// router.get('/callback',
//     passport.authenticate('google', {
//         // successRedirect: '/products',
//         // failureRedirect: '/products/failure'
//     } , (req , res)=>{
//         console.log("okeee");
//         console.log(req.user);
//     }) , 
// );



router.get('/callback',
    passport.authenticate('google', { failureRedirect: '/products/failure' }),
    AuthController.Auth
);

router.get('/products', (req, res) => {
    if(!req.user)
        return res.redirect('/products/failure');
    console.log(req.user);

    res.send("Welcome " + req.user);
});

module.exports = router;