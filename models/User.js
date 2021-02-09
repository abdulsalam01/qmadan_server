'user strict';

const mongoose = require('mongoose');
// const timestamps = require('mongoose-timestamp');

const userSchema = mongoose.Schema({
  'name': String,
  'username': String,
  'password': String
});

//
// userSchema.plugin(timestamps);
module.exports = mongoose.model('User', userSchema, 'users');
