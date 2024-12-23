import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import axios from "axios";
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const { TabPane } = Tabs;

function ProfileScreen() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const profileStyles = {
        container: {
            maxWidth: '1200px',
            margin: '2rem auto',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
        },
        tabContent: {
            padding: '2rem'
        },
        profileSection: {
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderRadius: '8px',
            marginTop: '1rem'
        },
        heading: {
            color: '#2c3e50',
            marginBottom: '1.5rem',
            borderBottom: '2px solid #3498db',
            paddingBottom: '0.5rem'
        },
        userInfo: {
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        },
        label: {
            color: '#7f8c8d',
            fontSize: '1.1rem',
            marginRight: '0.5rem'
        },
        value: {
            color: '#2c3e50',
            fontSize: '1.2rem',
            fontWeight: '500'
        }
    };

    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
        }
    }, []);

    return (
        <div style={profileStyles.container}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Profile" key="1">
                    <div style={profileStyles.tabContent}>
                        <h1 style={profileStyles.heading}>My Profile</h1>
                        <div style={profileStyles.profileSection}>
                            <div style={profileStyles.userInfo}>
                                <h2>
                                    <span style={profileStyles.label}>Name:</span>
                                    <span style={profileStyles.value}>{user.name}</span>
                                </h2>
                                <h3>
                                    <span style={profileStyles.label}>Email:</span>
                                    <span style={profileStyles.value}>{user.email}</span>
                                </h3>
                            </div>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="Bookings" key="2">
                    <div style={profileStyles.tabContent}>
                        <MyBookings user={user} />
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default ProfileScreen;

export function MyBookings({ user }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const bookingStyles = {
        container: { padding: '20px' },
        card: {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '20px',
            marginBottom: '20px',
            transition: 'transform 0.2s ease',
            border: '1px solid #e0e0e0',
        },
        hallName: {
            fontSize: '24px',
            color: '#2c3e50',
            marginBottom: '15px',
            borderBottom: '2px solid #3498db',
            paddingBottom: '8px',
        },
        bookingDetails: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            marginBottom: '20px',
        },
        detailItem: { display: 'flex', flexDirection: 'column' },
        label: { color: '#7f8c8d', fontSize: '14px', marginBottom: '4px' },
        value: { color: '#2c3e50', fontSize: '16px', fontWeight: '500' },
        status: {
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'inline-block',
            fontWeight: '500',
            fontSize: '14px',
            textTransform: 'uppercase',
        },
        statusConfirmed: { backgroundColor: '#27ae60', color: '#fff' },
        statusCancelled: { backgroundColor: '#e74c3c', color: '#fff' },
        cancelButton: {
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
    };

    // Cancel booking function
    const cancelBooking = async (bookingid, hallid) => {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/bookings/cancelbooking", { bookingid, hallid });
    
            if (data.success) {
                Swal.fire('Success', data.message, 'success');
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking._id === bookingid ? { ...booking, status: 'cancelled' } : booking
                    )
                );
            } else {
                throw new Error(data.error || "Cancellation failed");
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            Swal.fire('Oops', error.response?.data?.error || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    
    

    // Fetch bookings
    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const { data } = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id });
                console.log('Fetched Bookings:', data);  
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user._id]);

    return (
        <div style={bookingStyles.container}>
            {loading && <Loader />}
            {error && <p style={{ color: '#e74c3c', textAlign: 'center' }}>{error}</p>}
            {!loading && !error && bookings.length === 0 && (
                <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '18px' }}>
                    No bookings found
                </p>
            )}

            <div className="row">
                {bookings.map((booking) => (
                    <div className="col-md-6 col-lg-6 mb-4" key={booking._id}>
                        <div style={bookingStyles.card}>
                            <h2 style={bookingStyles.hallName}>{booking.hall}</h2>
                            
                            <div style={bookingStyles.bookingDetails}>
                                <div style={bookingStyles.detailItem}>
                                    <span style={bookingStyles.label}>Booking ID</span>
                                    <span style={bookingStyles.value}>{booking._id}</span>
                                </div>
                                
                                <div style={bookingStyles.detailItem}>
                                    <span style={bookingStyles.label}>Check-In</span>
                                    <span style={bookingStyles.value}>
                                        {new Date(booking.fromdate).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div style={bookingStyles.detailItem}>
                                    <span style={bookingStyles.label}>Check-Out</span>
                                    <span style={bookingStyles.value}>
                                        {new Date(booking.todate).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div style={bookingStyles.detailItem}>
                                    <span style={bookingStyles.label}>Amount</span>
                                    <span style={bookingStyles.value}>
                                        LKR {booking.totalamount}
                                    </span>
                                </div>
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '20px'
                            }}>
                                <span style={{
                                    ...bookingStyles.status,
                                    ...(booking.status === 'booked' 
                                        ? bookingStyles.statusConfirmed 
                                        : bookingStyles.statusCancelled)
                                }}>
                                    {booking.status === 'booked' ? 'CONFIRMED' : 'CANCELLED'}
                                </span>

                                {booking.status !== 'cancelled' && (
                                    <button
                                        style={bookingStyles.cancelButton}
                                        onClick={() => cancelBooking(booking._id, booking.hallid)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Cancel Booking'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

