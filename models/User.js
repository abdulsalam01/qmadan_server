'user strict';

const mongoose, { Schema } = require('mongoose');
const timestamps = require('mongoose-timestamp');

const userSchema = Schema({
  'name': String,
  'username': String,
  'password': String
});

//
userSchema.plugin(timestamps);

module.exports = userSchema.model('User', userSchema, 'users');
