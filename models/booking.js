const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall',
        required: true,  // Ensure the hall is required
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
    }
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
