var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WishlistItemSchema = new Schema({

     name:{type:String,required:true, index:{unique:true}},
     number:{type:String,required:true, index:{unique:true}},
 });

var WishlistItemModel = mongoose.model('wishlistitem',WishlistItemSchema);

module.exports = WishlistItemModel;