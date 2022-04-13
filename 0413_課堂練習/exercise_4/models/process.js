const mongoose = require('mongoose');

const { Schema } = mongoose;

processSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'exercise_orders',
    required: true,
  },
  begin: {
    type: Schema.Types.Date,
    required: true,
  },
  end: {
    type: Schema.Types.Date,
    required: true,
  },
  period: {
    type: Schema.Types.Number,
    required: true,
  },
  completed: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
  },
});

const Process = mongoose.model('exercise_processes', processSchema);

module.exports = Process;
