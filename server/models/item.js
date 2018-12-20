var mongoose = require('mongoose');

var Item = mongoose.model('Item', {
  category: {
    type: String,
    minlength: 1,
    trim: true,
    required: true,
  },
  product: {
    title: {
      type: String,
      minlength: 1,
      trim: true,
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      required: true
    },
    added: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      minlength: 1,
      trim: true,
      required: true
    }
  }
});

module.exports = {Item};
