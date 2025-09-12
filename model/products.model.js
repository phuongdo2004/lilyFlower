const unicode = require("unidecode");
var mongoose = require('mongoose');
slug = require('mongoose-slug-updater'),
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const productSchema = new Schema({
 title : String ,
 product_category_id:String,
 description:String ,
 price: Number,
 discountPercentage:Number,
 stock: Number,
 thumbnail: String , 
 status: String , 
 featured :String ,
 createdBy: String , 
 deletedBy : String, 
 updatedBy : String , 
 position: Number  , 
 deleted:{
  type: Boolean  , 
  default: false
 } , 
 slug:{
  type: String , 
  slug:"title" , 
  unique: true
 } , 

 searchable_text: String // Sẽ lưu trữ title + description (unidecode, không khoảng trắng)
} , {
  timestamps : true
});
// Middleware (hook) để tạo giá trị cho title_unidecode và description_unidecode
// Sẽ chạy TRƯỚC khi một tài liệu được lưu (save) hoặc cập nhật (findOneAndUpdate)
productSchema.pre('save', function(next) {
    // 'this' ở đây tham chiếu đến tài liệu (document) hiện tại đang được lưu
    // TẠO GIÁ TRỊ CHO searchable_text
    let combinedText = '';
    if (this.title) {
        combinedText += this.title;
    }
    if (this.description) {
        // Thêm khoảng trắng để tách biệt từ của title và description trước khi loại bỏ tất cả khoảng trắng
        combinedText += ' ' + this.description;
    }
    // Chuyển đổi sang không dấu, chữ thường, và loại bỏ TẤT CẢ khoảng trắng/gạch nối
    this.searchable_text = unicode(combinedText).toLowerCase().replace(/[\s-]/g, '');
    
    next(); // Tiếp tục quá trình lưu
});

const Product = mongoose.model("Product" , productSchema , "products");

module.exports = Product;

