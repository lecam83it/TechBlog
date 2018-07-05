var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    "title": String,
    "content": String,
    "author": String,
    "created_at": Date,
    "updated_at": Date,
});
module.exports = mongoose.model('post', postSchema);