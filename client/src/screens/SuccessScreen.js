import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
const moment = require('moment');


const SuccessScreen = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get("session_id");

        console.log(`Session ID from URL: ${sessionId}`);

        if (!sessionId) {
            setError("Session ID not found. Unable to confirm booking.");
            setLoading(false);
            return;
        }

        const confirmBooking = async () => {
            try {
                console.log(`Fetching booking details from: http://localhost:5000/api/bookings/getbookingdetails?session_id=${sessionId}`);
                
                const response = await axios.get(`http://localhost:5000/api/bookings/getbookingdetails?session_id=${sessionId}`);
                console.log("Booking Details:", response.data);

                setBooking(response.data.booking);
            } catch (err) {
                console.error("Error confirming booking:", err.response?.data || err.message);
                setError("Failed to confirm booking.");
            } finally {
                setLoading(false);
            }
        };

        confirmBooking();
    }, [location]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Booking Confirmed!</h2>
            <p>Hall: {booking?.hall}</p>
            <p>From: {moment(booking?.fromdate).format("DD-MM-YYYY")}</p>
            <p>To: {moment(booking?.todate).format("DD-MM-YYYY")}</p>
            <p>Total Amount: {booking?.totalamount} LKR</p>
        </div>
    );
};

export default SuccessScreen;
