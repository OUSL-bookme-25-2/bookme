const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hall',
      required: true, // Ensure the hall is required
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fromdate: {
      type: Date,
      required: true,
    },
    todate: {
      type: Date,
      required: true,
    },
    totalamount: {
      type: Number,
      required: true,
    },
    totaldays: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensure transactionId is unique
    },
    status: {
      type: String,
      required: true,
      default: 'booked', // Default status when booking is created
      enum: ['booked', 'cancelled', 'completed'], // Valid statuses
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;