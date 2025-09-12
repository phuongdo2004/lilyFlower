const express = require("express");
const systemConfig = require("./config/system.config");
const database = require("./config/database");
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser')
const path = require("path");
const passport = require('passport');
const  session = require('express-session');
const flash = require('express-flash');
const routerClient  = require("./routers/client/index.router");
const routerAdmin = require("./routers/admin/index.router");
const chatSocket = require("./socket/client/chat.socket");
require('./passport');




const app = express();
//nhung thu vien dotenv vao
require('dotenv').config()
//mac dinh di den thu muc views
app.set("views" , `${__dirname}/views`);
// dinh nghia template engine
app.set("view engine" , "pug");
// nhung file tinnh neu muon truy ccap thi chi can / la di vao thu muc public r vd(/css/style)
/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Socket .IO
const http = require('http');
// truyen fameword vao 
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

// global la bien tong tat ca cac file js ben BE deu dung dc
// dat bien ten la _io
global._io = io;
// chatSocket.chatSocket(io);

// const cartSocket  = require("./socket/client/cart.socket");
// cartSocket(_io);
// Lắng nghe kết nối từ client

// END Socket.io



app.use(cookieParser())
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));



// nhung body parse( phai nhung  trc routerAdmin de no chay tthi no dc tich hop san )
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// dinh nghia r a1 bien co noi dung la admin de dung di dung lai n lan (chi dung trong nhung file pug thoi)
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(methodOverride('_method'));


app.use(express.static(`${__dirname}/public`));

// de ho tro tieeng viet trong pug
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(session({
  secret: "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",  // Thay bằng secret key của bạn
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }  // Cookie lưu trong 1 phút
}));
app.use(passport.initialize());
app.use(passport.session());

// app.get('/auth', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));

// app.get('/auth/callback',
//     passport.authenticate('google', {
//         successRedirect: '/products',
//         failureRedirect: '/products/failure'
//     }) , (req , res)=>{
//       console.log("Ma uy quyen" ,req.query.code);
//     }
// );

// app.get('/products', (req, res) => {
//     if(!req.user)
//         return res.redirect('/products/failure');
//     console.log(req.user);

//     res.send("Welcome " + req.user);
// });

app.get('/products/failure', (req, res) => {
    res.send("Error");
});

// Cấu hình express-flash
app.use(flash());
// multer de upload file
const multer  = require('multer')


// express-flash end

// --- nên để router ở cuối để những j cài đặt dtrc đos nhuw flash router nhận đc

// Create a namespace for admin-specific communications (example for future use)
// const adminNsp = io.of("/admin");


// --- SOCKET HANDLERS ---
// Pass the client namespace to your client chat socket handler
// chatSocket.chatSocket();

// lay bien PORT trong file env ra 
routerAdmin.index(app);

routerClient.index(app);


const port = 600;
// ket noi db
database.connect();


server.listen(port , ()=>{
    console.log(`App listenning on port ${port}`);
  });