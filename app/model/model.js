/**
 * Created by shubham on 7/11/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    name : String,
    password :String,
    email:String
});


var UserSchema = new Schema({
    name: String,
    email: String,
    description : String,
    city : String,
    instaname : String
});

module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Admin', adminSchema);


