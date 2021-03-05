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
  'image': {
    type: String
  },
  'category': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  'created_by': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {collection: 'stories'});

storySchema.index({ title: 'text' });

module.exports = mongoose.model('Story', storySchema);
