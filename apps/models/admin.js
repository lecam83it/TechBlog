var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    "email": String,
    "password": String,
    "first_name": String,
    "last_name": String,
});
module.exports = mongoose.model('admin', adminSchema);