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
  'file': {
    type: String
  },
  'type': {
    type: String,
    enum: ['video', 'image', 'document', 'other'],
    default: 'image'
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

storySchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('Story', storySchema);
