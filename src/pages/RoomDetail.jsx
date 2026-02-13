
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Calendar, Clock, CreditCard, ChevronRight, ArrowLeft, ShieldCheck, Info, User, MapPin } from 'lucide-react';

const RoomDetail = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [hostel, setHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        duration: 1,
        studentName: user?.name || '',
        college: user?.college || '',
        phone: user?.phone || ''
        // MapPinned not used anymore
    });

    useEffect(() => {
        if (user) {
            setBookingData(prev => ({
                ...prev,
                studentName: user.name || '',
                college: user.college || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchDetails = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const roomSnap = await getDoc(doc(db, 'rooms', id));
                if (roomSnap.exists()) {
                    const roomData = { id: roomSnap.id, ...roomSnap.data() };
                    setRoom(roomData);

                    if (roomData.hostelId) {
                        const hostelSnap = await getDoc(doc(db, 'hostels', roomData.hostelId));
                        if (hostelSnap.exists()) {
                            setHostel({ id: hostelSnap.id, ...hostelSnap.data() });
                        } else {
                            console.error("Hostel not found for room");
                            setHostel({ name: 'Unknown Hostel' }); // Fallback to allow page to load
                        }
                    }
                } else {
                    console.error("Room not found");
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, user, navigate]);

    const totalAmount = room ? room.price * bookingData.duration : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const tempBooking = {
            ...bookingData,
            roomId: room.id,
            roomType: room.type,
            hostelName: hostel.name,
            totalAmount,
            studentId: user.id || user.email,
            date: new Date().toLocaleDateString()
        };
        navigate('/payment', { state: { bookingData: tempBooking } });
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-subtle)' }}>
            <div className="animate-spin" style={{ width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
        </div>
    );

    if (!room || !hostel) return (
        <div className="container" style={{ padding: '150px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Room or Property Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The booking link you followed might be broken or expired.</p>
            <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
        </div>
    );

    return (
        <div className="theme-rose" style={{ minHeight: '100vh' }}>
            <div style={{ padding: '120px 24px 80px', background: '#f8fafc', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <header style={{ marginBottom: '40px' }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '12px', fontSize: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ArrowLeft size={18} /> Back to Property
                        </button>
                        <h1 style={{ fontSize: '48px', marginTop: '24px', letterSpacing: '-1.5px' }}>Almost There! <span className="gradient-text">Finalize Booking</span></h1>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }} className="booking-grid">
                        {/* Summary Card */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', borderRadius: '32px', overflow: 'hidden' }}>
                                <div style={{ height: '200px', width: '100%' }}>
                                    <img
                                        src={room.image || 'https://images.unsplash.com/photo-1522771739844-6a9fb69e2b87?auto=format&fit=crop&w=800&q=80'}
                                        alt={room.type}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522771739844-6a9fb69e2b87?auto=format&fit=crop&w=800&q=80' }}
                                    />
                                </div>
                                <div style={{ padding: '40px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '14px' }}><Info size={28} /></div>
                                        <h3 style={{ fontSize: '24px' }}>Stay Summary</h3>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Selected Hostel</span>
                                            <span style={{ fontWeight: 700 }}>{hostel.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Room Configuration</span>
                                            <span style={{ fontWeight: 700 }}>{room.type}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Monthly Rent</span>
                                            <span style={{ fontWeight: 700 }}>₹{room.price}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Occupancy</span>
                                            <span style={{ fontWeight: 700 }}>{room.capacity} Student{room.capacity > 1 ? 's' : ''}</span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '40px', background: 'rgba(255,255,255,0.05)', padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Total Amount to Pay</div>
                                        <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--primary-light)' }}>₹{totalAmount}</div>
                                    </div>
                                </div>

                                <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ color: '#16a34a', background: '#dcfce7', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '800' }}>Safe & Secure</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Verified payments and instant confirmation</p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Form */}
                            <div className="card" style={{ padding: '48px', background: 'white', borderRadius: '40px', border: '1px solid var(--border-light)' }}>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                            <Calendar size={24} color="var(--primary)" />
                                            <h4 style={{ fontSize: '20px' }}>Date & Duration</h4>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div>
                                                <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>CHECK-IN DATE</label>
                                                <input
                                                    type="date"
                                                    value={bookingData.checkIn}
                                                    onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>DURATION (MONTHS)</label>
                                                <select
                                                    value={bookingData.duration}
                                                    onChange={(e) => setBookingData({ ...bookingData, duration: parseInt(e.target.value) })}
                                                    required
                                                    style={{ height: '64px' }}
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 12].map(m => <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ height: '1px', background: 'var(--border-light)' }}></div>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                            <User size={24} color="var(--primary)" />
                                            <h4 style={{ fontSize: '20px' }}>Student Details</h4>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            <div>
                                                <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>RESIDENT NAME</label>
                                                <input
                                                    type="text"
                                                    value={bookingData.studentName}
                                                    onChange={(e) => setBookingData({ ...bookingData, studentName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                                                <div>
                                                    <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>COLLEGE / UNIVERSITY</label>
                                                    <input
                                                        type="text"
                                                        value={bookingData.college}
                                                        onChange={(e) => setBookingData({ ...bookingData, college: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>PHONE</label>
                                                    <input
                                                        type="text"
                                                        value={bookingData.phone}
                                                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary" style={{ height: '70px', marginTop: '16px', borderRadius: '24px', fontSize: '20px' }}>
                                        Secure Checkout <ChevronRight size={24} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <style>{`
                @media (max-width: 992px) {
                    .booking-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
