'use strict';

const mongoose = require('mongoose');
const storySchema = mongoose.Schema({
  'title': {
    type: String,
    required: true
  },
  'body': {
    type: String,
    required: true,
  },
  'created_at': {
    type: Date,
    default: Date.now
  },
  'category': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
}, {collection: 'story'});

module.exports = mongoose.model('Story', storySchema);
