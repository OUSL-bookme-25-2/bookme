const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    hall: {
      type: String,
      ref: 'Hall',
      required: true, // Ensure the hall is required
    },
    hallid : {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      ref: 'User',
      required: true,
    },
    fromdate: {
      type: String,
      required: true,
    },
    todate: {
      type: String,
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
      unique: true, 
    },
    status: {
      type: String,
      required: true,
      default: 'booked',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;