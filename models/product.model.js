const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    require: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category"
  },
  brand: {
    type: String,
    enum: ["Apple", "Samsung", "lenovo"]
  },
  sold: {
    type: Number,
    default: 0
  },
  images: {
    type: Array
  },
  color: {
    type: String,
    enum: ["Black", "Brown", "Red"]
  },
  ratings: [{
    star: Number,
    postedBy: { type: mongoose.Types.ObjectId, ref: "User" }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);