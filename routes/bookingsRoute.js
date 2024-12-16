const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Hall = require('../models/hall');
const stripe = require('stripe')('sk_test_51QVxg6RqwHG4Issu9mUK923sX2mYUNiidY5w3LbaHS8zrvnqdSYMyh42XXuUCqhwFJOHU0SdYiYQvafilxB03cVx00Ya38sT5g');
const moment = require('moment');

// Create Stripe Checkout Session
// Backend: /api/bookings/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
    const { hallid, userid, fromdate, todate, totalamount, totaldays, successUrl, cancelUrl } = req.body;

    try {
        const hall = await Hall.findById(hallid);
        if (!hall) return res.status(404).json({ message: 'Hall not found' });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'LKR',
                        product_data: {
                            name: hall.name,
                            description: `Booking from ${fromdate} to ${todate} for ${totaldays} days`,
                        },
                        unit_amount: totalamount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,  // Hardcode the frontend URL
            cancel_url: cancelUrl || `${req.headers.origin}/cancel`,
            metadata: {
                hallid,
                userid,
                fromdate,
                todate,
                totaldays,
                phoneNumber: hall.PhoneNumber,
            },
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});


// Confirm booking after successful payment
router.post('/confirm-booking', async (req, res) => {
    const { sessionId } = req.body;

    try {
        // Log the sessionId to ensure it's coming correctly from the frontend
        console.log('Session ID:', sessionId);

        // Retrieve the session data from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        // Log the session to check if it's being fetched correctly
        console.log('Stripe Session:', session);

        if (!session || session.payment_status !== 'paid') {
            console.log('Payment not successful');
            return res.status(400).json({ message: 'Payment not successful' });
        }

        const { hallid, userid, fromdate, todate, totaldays } = session.metadata;

        // Validate hall existence
        const hall = await Hall.findById(hallid);
        if (!hall) {
            console.log('Hall not found');
            return res.status(404).json({ message: 'Hall not found' });
        }

        // Validate that fromdate and todate are valid dates
        if (isNaN(new Date(fromdate)) || isNaN(new Date(todate))) {
            console.log('Invalid dates:', fromdate, todate);
            return res.status(400).json({ message: 'Invalid booking dates' });
        }

        // Check for overlapping bookings
        const overlappingBookings = hall.currentBookings.some(booking =>
            (new Date(fromdate) <= new Date(booking.todate) && new Date(todate) >= new Date(booking.fromdate))
        );
        
        if (overlappingBookings) {
            console.log('Overlapping bookings detected');
            return res.status(400).json({ message: 'Hall is already booked for the selected dates' });
        }

        // Create booking
        const booking = new Booking({
            hall: hall._id,
            userid,
            fromdate: new Date(fromdate),
            todate: new Date(todate),
            totaldays,
            totalamount: session.amount_total / 100,  // Convert from cents to LKR
            transactionId: session.payment_intent,
        });

        // Save booking
        const savedBooking = await booking.save();

        // Update hall's current bookings
        hall.currentBookings.push({
            bookingid: savedBooking._id,
            fromdate: new Date(fromdate),
            todate: new Date(todate),
            userid,
            status: 'booked',
        });
        hall.markModified('currentBookings');
        await hall.save();

        console.log('Booking confirmed:', savedBooking);

        res.status(200).json({ success: true, booking: savedBooking });
    } catch (error) {
        console.error('Error confirming booking:', error);  // Log detailed error
        res.status(500).json({ message: 'Failed to confirm booking' });
    }
});



module.exports = router;
