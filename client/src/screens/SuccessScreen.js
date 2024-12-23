import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function SuccessScreen() {
    const [bookingDetails, setBookingDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false); 
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const confirmBooking = async () => {
            try {
                const { data } = await axios.post('/api/bookings/confirm-booking', { sessionId });
        
                if (data.success && data.booking) {
                    setBookingDetails(data.booking);
                    setIsConfirmed(true);
                } else {
                    setErrorMessage(data.message || 'Failed to confirm booking.');
                }
            } catch (error) {
                console.error('Error confirming booking:', error.response?.data?.message || error.message);
                setErrorMessage(error.response?.data?.message || 'Internal Server Error. Please try again later.');
            }
        };
        

        if (sessionId && !isConfirmed) {
            confirmBooking(); // Call API only once
        } else if (!sessionId) {
            setErrorMessage('Missing session ID');
        }
    }, [sessionId, isConfirmed]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formats date to the user's locale
    };

    return (
        <div className="container">
            <h1>Payment Successful</h1>
            {errorMessage ? (
                <p style={{ color: 'red' }}>{errorMessage}</p> // Show error if booking confirmation fails
            ) : bookingDetails ? (
                <div>
                    <p>Booking confirmed for: {bookingDetails.hall.name}</p>
                    <p>Booking Dates: {formatDate(bookingDetails.fromdate)} to {formatDate(bookingDetails.todate)}</p>
                    <p>Total Amount: LKR {bookingDetails.totalamount}</p>
                </div>
            ) : (
                <p>Confirming your booking...</p> // Show message while confirming the booking
            )}
        </div>
    );
}

export default SuccessScreen;
