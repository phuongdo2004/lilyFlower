
const systemConfig = require("../../config/system.config");
const categoryRouter  = require("./product-category.router");
const productsRouter = require("./products.router");
const rolesRouter = require("./roles.router");
const rolePermissionRouter = require("./role-permission.router");
const accountRouter = require("./account.router");
const dashboardRouter = require("./dashboard.router");
const authRouter = require("./auth.route");
const MiddleWareAutth = require("../../middlewares/admin/auth.middleware");
const orderRouter = require("./order.route");
const notificattionRouter = require("./notification.route.js");
const chatRouter = require("./chat.route.js");



module.exports.index = (app)=>{

app.use(`/${systemConfig.prefixAdmin}/product-category` , categoryRouter );
app.use(`/${systemConfig.prefixAdmin}/products`  ,MiddleWareAutth.requireAuth  ,productsRouter);
app.use(`/${systemConfig.prefixAdmin}/roles` ,MiddleWareAutth.requireAuth  ,rolesRouter);
app.use(`/${systemConfig.prefixAdmin}/permissionRoles`,MiddleWareAutth.requireAuth  ,rolePermissionRouter);
app.use(`/${systemConfig.prefixAdmin}/accounts` ,MiddleWareAutth.requireAuth  , accountRouter);
app.use(`/${systemConfig.prefixAdmin}/dashboard`,MiddleWareAutth.requireAuth  ,dashboardRouter);
app.use(`/${systemConfig.prefixAdmin}/auth` ,authRouter );

app.use(`/${systemConfig.prefixAdmin}/orders` ,orderRouter );
app.use(`/${systemConfig.prefixAdmin}/notifications` ,notificattionRouter );

app.use(`/${systemConfig.prefixAdmin}/chats` ,chatRouter );



}



