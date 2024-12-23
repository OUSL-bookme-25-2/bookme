const mongoose = require('mongoose');

const hallSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    maxCount: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,  
        required: false
    },
    rentPerDay: {
        type: Number,
        required: true
    },
    imageUrls: [String], // Array to store image URLs
    currentBookings: [ // Array to store bookings associated with the hall
        {
            bookingid: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
            fromdate: { type: String, required: true },
            todate: { type: String, required: true },
            userid: { type: String, required: true },
            status: { type: String, default: 'booked' }
        }
    ],
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const hallModel = mongoose.model('Hall', hallSchema);
module.exports = hallModel;
