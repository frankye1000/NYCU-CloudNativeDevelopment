const mongoose = require('mongoose');

const { Schema } = mongoose;

orderSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  completed: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
  },
});

const Order = mongoose.model('exercise_orders', orderSchema);

module.exports = Order;
