var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var UserSchema = new Schema({
    
    usernumber:{type:String,index:{unique:true}},
    name:{type:String,required:true},
    username: {type:String,required:true,index:{unique:true}},
    password: {type:String,required:true,select:false},
    mobile: {type:String,required:true},
    email: {type:String,index:{unique:true}},
    created:{type:Date,default:Date.now},
    role:{type:String,default:'user'}
});

var UserModel = mongoose.model('users',UserSchema);

module.exports = UserModel;