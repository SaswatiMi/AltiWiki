var mongoose = require('mongoose');
var BaseSchema = new mongoose.Schema({
  name: String,
  tech: Boolean,
  content: String
});
module.exports = mongoose.model('Article', BaseSchema);