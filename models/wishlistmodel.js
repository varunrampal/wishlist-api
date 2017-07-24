var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WishListSchema = new Schema({

  usernumber:{type:String,required:true},
  wishlistnumber:{type:String,required:true,index:{unique:true}},
  wishlistname:{type:String,required:true,index:{unique:true}},
  created:{type:Date,default:Date.now},
  items:[{ name:String,number:String}]
});

var WishListModel = mongoose.model('wishlists',WishListSchema);

module.exports = WishListModel;