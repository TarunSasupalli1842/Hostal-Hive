
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/storage';
import { getStudentBookings } from '../utils/firebaseService';
import { BookMarked, MapPin, Calendar, Clock } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const user = getCurrentUser();

    useEffect(() => {
        if (user) {
            const fetchBookings = async () => {
                const data = await getStudentBookings(user.id);
                setBookings(data);
            };
            fetchBookings();
        }
    }, [user]);


    return (
        <div className="theme-emerald" style={{ minHeight: '100vh' }}>
            <div className="container" style={{ padding: '130px 16px 60px' }}>
                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '800' }}>My Bookings</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your accommodation history</p>
                </header>

                {bookings.length === 0 ? (
                    <div className="card" style={{ padding: '60px', textAlign: 'center', background: '#f8fafc' }}>
                        <BookMarked size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                        <h3 style={{ marginBottom: '8px' }}>No bookings found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>You haven't booked any rooms yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
                        {bookings.map(booking => (
                            <div key={booking.id} className="card animate-fade" style={{ padding: '24px', borderLeft: '6px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{booking.hostelName}</h3>
                                        <span className="badge badge-blue">{booking.roomType}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '18px', fontWeight: '800' }}>₹{booking.totalAmount}</div>
                                        <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700' }}>PAID</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={16} /> Check-in: {booking.checkIn}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={16} /> Duration: {booking.duration} Mo
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={16} /> ID: {booking.id}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
