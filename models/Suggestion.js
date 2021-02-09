'use strict';

const mongoose = require('mongoose');
const suggestionSchema = mongoose.Schema({
  'body': {
    type: String,
    required: true
  },
  'by': String,
  'phone': String,
  'created_at': {
    type: Date,
    default: Date.now
  }
}, {collection: 'suggestions'});

module.exports = mongoose.model('Suggestion', suggestionSchema);
