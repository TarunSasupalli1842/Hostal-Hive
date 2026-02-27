
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/storage';
import { getStudentBookings, getOwnerDetails } from '../utils/firebaseService';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BookMarked, MapPin, Calendar, Clock, Phone, X, User } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [owner, setOwner] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [fetchingOwner, setFetchingOwner] = useState(false);
    const user = getCurrentUser();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchBookings = async () => {
            setLoading(true);
            setError('');
            try {
                // Bookings may have been saved with either user.id OR user.email as studentId
                // So we query by both and merge results
                const bookingsRef = collection(db, 'bookings');
                const results = new Map();

                if (user.id) {
                    const q1 = query(bookingsRef, where('studentId', '==', user.id));
                    const snap1 = await getDocs(q1);
                    snap1.docs.forEach(d => results.set(d.id, { id: d.id, ...d.data() }));
                }

                if (user.email) {
                    const q2 = query(bookingsRef, where('studentId', '==', user.email));
                    const snap2 = await getDocs(q2);
                    snap2.docs.forEach(d => results.set(d.id, { id: d.id, ...d.data() }));
                }

                setBookings(Array.from(results.values()));
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                setError('Could not load your bookings. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, user?.email]);

    const handleContactManager = async (ownerId) => {
        if (!ownerId) {
            alert("No manager details available for this booking.");
            return;
        }

        setFetchingOwner(true);
        try {
            const data = await getOwnerDetails(ownerId);
            if (data) {
                setOwner(data);
                setShowContactModal(true);
            } else {
                alert("Manager details could not be found.");
            }
        } catch (err) {
            console.error(err);
            alert("Error fetching manager details.");
        } finally {
            setFetchingOwner(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-subtle)', paddingTop: '130px', paddingBottom: '80px' }}>
            <div className="container">
                <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '8px' }}>My Bookings</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500' }}>Manage your accommodation search and history</p>
                    </div>
                </header>

                {!user ? (
                    <div className="card animate-fade" style={{ padding: '80px 40px', textAlign: 'center', borderRadius: '40px' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Please log in</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '400px', margin: '0 auto 32px' }}>You need to be logged in to view your bookings.</p>
                        <a href="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', padding: '16px 32px', borderRadius: '16px' }}>Login</a>
                    </div>
                ) : loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div className="animate-spin" style={{ width: '50px', height: '50px', border: '5px solid rgba(0,0,0,0.05)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto' }}></div>
                    </div>
                ) : error ? (
                    <div className="card animate-fade" style={{ padding: '60px 40px', textAlign: 'center', borderRadius: '40px', background: '#fef2f2', border: '1px solid #fee2e2' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626', marginBottom: '12px' }}>{error}</h3>
                        <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: '16px' }}>Try Again</button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="card animate-fade" style={{ padding: '80px 40px', textAlign: 'center', borderRadius: '40px' }}>
                        <div style={{ background: 'var(--bg-subtle)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                            <BookMarked size={48} style={{ color: 'var(--text-light)' }} />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>No bookings found</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '400px', margin: '0 auto 32px' }}>You haven't reserved any rooms yet. Start exploring properties to find your home.</p>
                        <a href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', padding: '16px 32px', borderRadius: '16px' }}>Explore Hostels</a>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
                        {bookings.map(booking => (
                            <div key={booking.id} className="card animate-fade hover-lift" style={{ padding: '32px', borderRadius: '32px', border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.02em' }}>{booking.hostelName}</h3>
                                        <div className="badge badge-primary" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontWeight: '800' }}>{booking.roomType}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)' }}>₹{booking.totalAmount}</div>
                                        <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '800', letterSpacing: '0.05em' }}>PAID & CONFIRMED</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', background: 'var(--bg-subtle)', padding: '24px', borderRadius: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-main)', fontWeight: '700' }}>
                                        <Calendar size={18} color="var(--primary)" /> {booking.checkIn}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-main)', fontWeight: '700' }}>
                                        <Clock size={18} color="var(--primary)" /> {booking.duration} Months
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600', gridColumn: 'span 2' }}>
                                        <MapPin size={18} /> Booking ID: {booking.id.slice(0, 8)}...
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleContactManager(booking.ownerId)}
                                    disabled={fetchingOwner}
                                    className="btn glass"
                                    style={{ width: '100%', height: '60px', borderRadius: '18px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: '800' }}
                                >
                                    <Phone size={20} /> {fetchingOwner ? 'Connecting...' : 'Contact Manager'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Modal */}
            {showContactModal && owner && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,15,29,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(12px)', padding: '24px' }}>
                    <div className="card animate-fade" style={{ width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '32px', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setShowContactModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--bg-subtle)', width: '36px', height: '36px', borderRadius: '10px' }}><X size={20} /></button>

                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px', fontWeight: '800', border: '4px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                            {owner.name?.charAt(0)}
                        </div>

                        <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>{owner.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>Hostel Property Manager</p>

                        <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Mobile Number</div>
                            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)' }}>{owner.phone || 'Contact Info Unavailable'}</div>
                        </div>

                        <a href={`tel:${owner.phone}`} className="btn-primary" style={{ height: '64px', borderRadius: '18px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', textDecoration: 'none' }}>
                            <Phone size={20} /> Call Manager Now
                        </a>
                    </div>
                </div>
            )}

            <style>{`
                .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .hover-lift:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
            `}</style>
        </div>
    );
};

export default MyBookings;
