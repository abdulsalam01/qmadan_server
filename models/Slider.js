'use strict';

const mongoose = require('mongoose');
const sliderSchema = mongoose.Schema({
  'title': String,
  'subtitle': String,
  'image': {
    type: String,
    required: true
  },
  'created_at': {
    type: Date,
    default: Date.now
  }
}, { collection: 'sliders'});

module.exports = mongoose.model('Slider', sliderSchema);
