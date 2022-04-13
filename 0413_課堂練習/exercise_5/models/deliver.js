const mongoose = require('mongoose');

const { Schema } = mongoose;

deliverSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'exercise_orders',
    required: true,
  },
  target: {
    type: Schema.Types.String,
    required: true,
  },
  completed: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
  },
});

const Deliver = mongoose.model('exercise_delivers', deliverSchema);

module.exports = Deliver;
