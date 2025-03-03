const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Hall = require('../models/hall');
const stripe = require('stripe')('sk_test_51QVxg6RqwHG4Issu9mUK923sX2mYUNiidY5w3LbaHS8zrvnqdSYMyh42XXuUCqhwFJOHU0SdYiYQvafilxB03cVx00Ya38sT5g');
const moment = require('moment');

// Create Stripe Checkout Session
// Backend: /api/bookings/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
    const { hallid, userid, fromdate, todate, totalamount, totaldays } = req.body;

    try {
        const hall = await Hall.findById(hallid);
        if (!hall) return res.status(404).json({ message: 'Hall not found' });

        // Ensure dates are in correct format
        const formattedFromDate = moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY");
        const formattedToDate = moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY");

        console.log("Formatted metadata being sent to Stripe:", {
            hallid,
            userid,
            fromdate: formattedFromDate,
            todate: formattedToDate,
            totaldays
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'LKR',
                    product_data: { name: hall.name },
                    unit_amount: totalamount * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/cancel`,
            metadata: {
                hallid: hall._id.toString(),
                userid: userid.toString(),
                fromdate: formattedFromDate,
                todate: formattedToDate,
                totaldays: totaldays.toString(),
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
    console.log('Confirming booking with session ID:', sessionId);

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('Stripe session retrieved:', session);

        if (!session || session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Payment not successful' });
        }

        const { hallid, userid, fromdate, todate, totaldays } = session.metadata;

        console.log("Received from Stripe metadata:", { fromdate, todate });


        const parsedFromDate = moment(fromdate, "DD-MM-YYYY").toDate();
        const parsedToDate = moment(todate, "DD-MM-YYYY").toDate();

        console.log("Parsed Dates:", parsedFromDate, parsedToDate);

        if (!parsedFromDate || !parsedToDate) {
            console.error("Invalid dates after parsing:", fromdate, todate);
            return res.status(400).json({ message: 'Invalid booking dates' });
        }

        const hall = await Hall.findById(hallid);
        if (!hall) {
            console.error(" Hall not found:", hallid);
            return res.status(404).json({ message: 'Hall not found' });
        }


        const transactionId = session.payment_intent || 'NO_TRANSACTION_ID';
        console.log("Transaction ID:", transactionId);

        const booking = new Booking({
            hall: hall._id,
            userid,
            fromdate: parsedFromDate,
            todate: parsedToDate,
            totaldays :parseInt(totaldays),
            totalamount:  session.amount_total,
            transactionId: transactionId,
            status : 'booked'
        });
        
        // Log before saving to MongoDB
        console.log("Saving booking to MongoDB:", booking);
        
        const savedBooking = await booking.save();
        console.log("Booking successfully saved in MongoDB:", savedBooking);
        
        const updatedHall = await Hall.findByIdAndUpdate(
            hall._id,
            {
                $push: {
                    currentBookings: {
                        bookingid: savedBooking._id,
                        fromdate: parsedFromDate,
                        todate: parsedToDate,
                        userid: userid,
                        status: 'booked'
                    }
                }
            },
            { new: true } 
        );
        

        if (!halltemp) {
            return res.status(404).json({ error: "Hall not found" });
        }

        console.log("Updated hall current bookings:", updatedHall.currentBookings);

        res.status(200).json({ success: true, booking: savedBooking });
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).json({ message: 'Failed to confirm booking' });
    }
});


router.post("/getbookingsbyuserid", async (req, res) => {
    const userid = req.body.userid

    try {
        const bookings = await Booking.find({userid : userid})
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({ error });
    }
});


router.post("/cancelbooking", async (req, res) => {
    const { bookingid, hallid } = req.body;

    try {
        // Find the booking by ID
        const bookingitem = await Booking.findOne({ _id: bookingid });
        if (!bookingitem) {
            return res.status(404).json({ success: false, error: "Booking not found" });
        }

        // Update booking status to "cancelled"
        bookingitem.status = 'cancelled';
        await bookingitem.save();

        // Find the hall by ID
        const hall = await Hall.findOne({ _id: hallid });
        if (!hall) {
            return res.status(404).json({ success: false, error: "Hall not found" });
        }

        // Remove the cancelled booking from the hall's current bookings
        hall.currentBookings = hall.currentBookings.filter(
            booking => booking.bookingid.toString() !== bookingid
        );

        await hall.save();

        // Send a success response
        res.status(200).json({ success: true, message: "Your booking was cancelled successfully" });
    } catch (error) {
        console.error('Error cancelling booking:', error); // Log error for debugging
        res.status(500).json({ success: false, error: "An internal server error occurred" });
    }
});



router.get("/getallbookings", async (req, res) => {

    try{
        const bookings = await Booking.find()
        res.send(bookings)
    } catch (error){
        return res.status(400).json({error});
    }

});

router.get("/getbookingdetails", async (req, res) => {
    const { session_id } = req.query;

    if (!session_id) return res.status(400).json({ message: "Session ID is required" });

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        console.log("Retrieved Stripe session:", session);

        if (!session || session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not successful" });
        }

        res.status(200).json({ success: true, metadata: session.metadata });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ message: "Failed to fetch booking details" });
    }
});

module.exports = router;
