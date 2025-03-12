import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';

const stripePromise = loadStripe('pk_test_51QVxg6RqwHG4IssuZZFEjCTlPfYfNqvCdu7kdIlGpeB4j9lf9G0h2CTnrBTOUUwtWwunjMfBxezzngGCIT9RbiRw00bNm3XSss');

function BookingScreen() {
    const { hallid, fromdate, todate } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hall, setHall] = useState(null);
    const navigate = useNavigate();

    const formattedFromDate = moment(fromdate, 'DD-MM-YYYY');
    const formattedToDate = moment(todate, 'DD-MM-YYYY');
    const totaldays = formattedToDate.diff(formattedFromDate, 'days') + 1;


    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchHall = async () => {
            try {
                const { data } = await axios.post('/api/halls/gethallbyid', { hallid })
                setHall(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching hall:', err);
                setError(true);
                setLoading(false);
            }
        };

        fetchHall();
    }, [hallid, navigate]);

 async function bookHall() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        Swal.fire('Oops', 'You are not logged in. Please log in to continue.', 'error');
        navigate('/login');
        return;
    }

    if (!hall) {
        Swal.fire('Oops', 'Error: Hall information is missing.', 'error');
        return;
    }

    try {
        setLoading(true);

        const { data } = await axios.post('/api/bookings/create-checkout-session', {
            hall,
            hallid,
            userid: currentUser._id,
            fromdate: formattedFromDate.format("DD-MM-YYYY"), 
            todate: formattedToDate.format("DD-MM-YYYY"),
            totalamount: totaldays * hall.rentPerDay,
            totaldays,
            successUrl: `${window.location.origin}/success`,
            cancelUrl: `${window.location.origin}/cancel`,
        });

        if (!data.sessionId) {
            Swal.fire('Error', 'Failed to create checkout session.', 'error');
            return;
        }

        const stripe = await stripePromise;
        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });

        if (result.error) {
            Swal.fire('Oops', 'Payment process failed.', 'error');
        }

    } catch (error) {
        console.error('Error during booking:', error);
        Swal.fire('Oops', 'Payment failed. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
}

    return (
        <div className="m-5">
            {loading ? (
                <Loader />
            ) : error ? (
                <Error />
            ) : (
                <div>
                    <div className="row justify-content-center mt-5 boxshadow">
                        <div className="col-md-6">
                            <h1>{hall?.name}</h1>
                            <img src={hall?.imageUrls[0]} className="bigimg" alt={hall?.name} />
                        </div>

                        <div className="col-md-6">
                            <div style={{ textAlign: 'right' }}>
                                <h1>Booking Details</h1>
                                <hr />
                                <p>Name: {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                                <p>From Date: {formattedFromDate.format('DD-MM-YYYY')}</p>
                                <p>To Date: {formattedToDate.format('DD-MM-YYYY')}</p>
                                <p>Total Days: {totaldays}</p>
                                <p>Rent Per Day: {hall?.rentPerDay}</p>
                                <p>Total Amount: LKR {totaldays * hall?.rentPerDay}</p>
                            </div>
                            <button className="btn btn-primary" onClick={bookHall} disabled={loading}>
                                {loading ? 'Processing...' : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingScreen;