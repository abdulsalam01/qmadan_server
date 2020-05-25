'use strict';

const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
  'title': {
    type: String,
    required: true
  },
  'logo': String,
  'created_at': {
    type: Date,
    default: Date.now
  },
  'created_by': [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }]
}, {collection: 'categories'});

module.exports = mongoose.model('Category', categorySchema);
