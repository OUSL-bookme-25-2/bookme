import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function SuccessScreen() {
    const location = useLocation();
    const [bookingDetails, setBookingDetails] = useState(null);
    const sessionId = new URLSearchParams(location.search).get('session_id');

    useEffect(() => {
        if (!sessionId) {
            alert('Session ID is missing');
            return;
        }

        // Send sessionId to your backend to confirm the booking
        const confirmBooking = async () => {
            try {
                const { data } = await axios.post('/api/bookings/confirm-booking', { sessionId });
                setBookingDetails(data.booking);
            } catch (error) {
                console.error('Error confirming booking:', error);
                alert('Booking confirmation failed');
            }
        };

        confirmBooking();
    }, [sessionId]);

    return (
        <div className="container">
            <h1>Payment Successful</h1>
            {bookingDetails ? (
                <div>
                    <p>Booking confirmed for: {bookingDetails.hall.name}</p>
                    <p>Booking Dates: {bookingDetails.fromdate} to {bookingDetails.todate}</p>
                    <p>Total Amount: LKR {bookingDetails.totalamount}</p>
                </div>
            ) : (
                <p>Confirming your booking...</p>
            )}
        </div>
    );
}

export default SuccessScreen;
