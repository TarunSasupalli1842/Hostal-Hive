
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Wifi, Home as HomeIcon, Coffee, Shirt, Shield, CheckCircle, ArrowLeft, Star, Share2, MapPin, Navigation, MessageSquare, Send } from 'lucide-react';
import { getCurrentUser } from '../utils/storage';
import { submitRating, getHostelRatings } from '../utils/firebaseService';

const AMENITY_ICONS = {
    "WiFi": <Wifi size={20} />,
    "Food": <Coffee size={20} />,
    "Laundry": <Shirt size={20} />,
    "Security": <Shield size={20} />,
    "Study Room": <CheckCircle size={20} />,
};

const HostelDetail = ({ user: propUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = propUser || getCurrentUser();
    const [hostel, setHostel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [activeImg, setActiveImg] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchDetails = async () => {
        const hostelRef = doc(db, 'hostels', id);
        const hostelSnap = await getDoc(hostelRef);

        if (hostelSnap.exists()) {
            const hostelData = { id: hostelSnap.id, ...hostelSnap.data() };
            setHostel(hostelData);

            const q = query(collection(db, 'rooms'), where("hostelId", "==", id));
            const roomsSnap = await getDocs(q);
            const allRooms = roomsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            // Only show rooms that have at least one unit available
            setRooms(allRooms.filter(room => room.available > 0));

            const ratings = await getHostelRatings(id);
            setReviews(ratings);

            // Check if user already rated
            if (user) {
                const myRating = ratings.find(r => r.studentId === user.id);
                if (myRating) {
                    setUserRating(myRating.rating);
                    setComment(myRating.comment || '');
                }
            }
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleRatingSubmit = async () => {
        if (!user) { navigate('/login'); return; }
        if (userRating === 0) { alert("Please select a rating"); return; }

        setSubmitting(true);
        try {
            await submitRating(id, {
                studentId: user.id,
                studentName: user.name,
                rating: userRating,
                comment: comment,
                date: new Date().toLocaleDateString()
            });
            await fetchDetails();
            alert("Rating submitted successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!hostel) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="animate-spin" style={{ width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
        </div>
    );

    return (
        <div className="theme-gold" style={{ minHeight: '100vh' }}>
            <div className="container" style={{ padding: '130px 32px 60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'white', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--border)', gap: '8px', fontSize: '16px', color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)' }}>
                        <ArrowLeft size={20} /> Back to Search
                    </button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', border: '1px solid var(--border)', padding: 0 }}><Share2 size={20} /></button>
                        <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', border: '1px solid var(--border)', padding: 0 }}><Star size={20} /></button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '48px' }} className="details-grid">
                    <div>
                        <div className="card" style={{ height: '600px', borderRadius: '32px', marginBottom: '24px', position: 'relative' }}>
                            <img
                                src={hostel.images?.[activeImg] || 'https://images.unsplash.com/photo-1555854817-5b2738a7528d?auto=format&fit=crop&w=800&q=80'}
                                alt={hostel.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854817-5b2738a7528d?auto=format&fit=crop&w=800&q=80' }}
                            />
                            <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
                                <span className="badge badge-green" style={{ background: 'white', boxShadow: 'var(--shadow)' }}>Verified Property</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '48px', overflowX: 'auto', paddingBottom: '8px' }}>
                            {(hostel.images || ['https://images.unsplash.com/photo-1555854817-5b2738a7528d?auto=format&fit=crop&w=800&q=80']).map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImg(idx)}
                                    className="card"
                                    style={{
                                        minWidth: '120px',
                                        height: '100px',
                                        cursor: 'pointer',
                                        borderRadius: '20px',
                                        border: activeImg === idx ? '3px solid var(--primary)' : '3px solid transparent',
                                        transform: activeImg === idx ? 'scale(1.05)' : 'scale(1)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt="preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854817-5b2738a7528d?auto=format&fit=crop&w=800&q=80' }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={{ background: 'white', padding: '48px', borderRadius: '32px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                            <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Property Overview</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '20px', lineHeight: '1.8', marginBottom: '40px' }}>
                                {hostel.description}
                            </p>

                            <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Amenities & Facilities</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {(Array.isArray(hostel.amenities) ? hostel.amenities : (hostel.amenities?.split(',') || [])).map((amenity, idx) => {
                                    const name = amenity?.trim?.() || (typeof amenity === 'string' ? amenity : '');
                                    if (!name) return null;
                                    return (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-subtle)', borderRadius: '20px' }}>
                                            <div style={{ color: 'var(--primary)' }}>{AMENITY_ICONS[name] || <CheckCircle size={20} />}</div>
                                            <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Ratings & Reviews Section */}
                        <div style={{ background: 'white', padding: '48px', borderRadius: '32px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginTop: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '32px' }}>User Ratings</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-subtle)', padding: '12px 24px', borderRadius: '20px' }}>
                                    <Star size={24} fill="#f59e0b" color="#f59e0b" />
                                    <span style={{ fontSize: '24px', fontWeight: '800' }}>{hostel.rating || '0'}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>({hostel.ratingCount || 0} reviews)</span>
                                </div>
                            </div>

                            {user && user.role === 'student' && (
                                <div style={{ background: 'var(--bg-subtle)', padding: '32px', borderRadius: '24px', marginBottom: '48px' }}>
                                    <h4 style={{ fontSize: '20px', marginBottom: '16px' }}>Rate this Property</h4>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={32}
                                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                fill={(hoverRating || userRating) >= star ? "#f59e0b" : "none"}
                                                color="#f59e0b"
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setUserRating(star)}
                                            />
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Share your experience (optional)..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        style={{ height: '120px', background: 'white', marginBottom: '20px' }}
                                    />
                                    <button
                                        className="btn-primary"
                                        onClick={handleRatingSubmit}
                                        disabled={submitting}
                                        style={{ height: '60px', width: '200px', borderRadius: '16px' }}
                                    >
                                        {submitting ? 'Posting...' : 'Submit Review'}
                                    </button>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {reviews.length > 0 ? reviews.map(review => (
                                    <div key={review.id} style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                                                    {(review.studentName || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '800' }}>{review.studentName || 'Anonymous'}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{review.date}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={review.rating >= s ? "#f59e0b" : "none"} color="#f59e0b" />)}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{review.comment || 'No comment provided.'}</p>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        <MessageSquare size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                                        <p>No reviews yet. Be the first to rate!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style={{ position: 'sticky', top: '40px' }}>
                            <div className="card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
                                <h1 style={{ fontSize: '42px', marginBottom: '8px', letterSpacing: '-1.5px' }}>{hostel.name}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={18} /> {hostel.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Navigation size={18} color="var(--primary)" /> {hostel.distance}
                                    </div>
                                </div>

                                <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: '24px', marginBottom: '32px' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Monthly Starting Price</div>
                                    <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--primary)' }}>₹{hostel.price}<span style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: '400' }}> / month</span></div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <a href="#rooms" className="btn-primary" style={{ width: '100%', height: '68px', borderRadius: '20px', fontSize: '18px' }}>
                                        Check Available Rooms
                                    </a>
                                    <div style={{ textAlign: 'center', fontSize: '15px', color: 'var(--text-light)' }}>
                                        Professional support • No hidden fees • Verified stays
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '24px' }}>{hostel.rating || 'New'}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>User Rating</div>
                                </div>
                                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '24px' }}>24/7</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Security</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section id="rooms" style={{ marginTop: '100px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '48px', marginBottom: '16px' }}>Available Room Types</h2>
                        <p style={{ fontSize: '20px', color: 'var(--text-muted)' }}>Choose the configuration that fits your budget and lifestyle</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '40px' }}>
                        {rooms.map(room => (
                            <div key={room.id} className="card" style={{ borderRadius: '32px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                                    <img
                                        src={room.image || 'https://images.unsplash.com/photo-1522771739844-6a9fb69e2b87?auto=format&fit=crop&w=800&q=80'}
                                        alt={room.type}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522771739844-6a9fb69e2b87?auto=format&fit=crop&w=800&q=80' }}
                                    />
                                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                                        <div className="badge badge-green" style={{ fontSize: '12px', borderRadius: '10px', boxShadow: 'var(--shadow)' }}>{room.available} Left</div>
                                    </div>
                                </div>
                                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>{room.type}</h3>

                                    <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: '24px', marginBottom: '32px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Capacity</span>
                                            <span style={{ fontWeight: 700, fontSize: '18px' }}>{room.capacity} Student{room.capacity > 1 ? 's' : ''}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Maintenance</span>
                                            <span style={{ fontWeight: 700, fontSize: '18px', color: '#16a34a' }}>Included</span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 'auto' }}>
                                        <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '24px' }}>
                                            ₹{room.price}<span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '400' }}>/mo per head</span>
                                        </div>
                                        <Link to={`/room/${room.id}`} className="btn-primary" style={{ width: '100%', height: '64px', borderRadius: '20px', textDecoration: 'none' }}>
                                            Reserve Room Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <style>{`
                    @media (max-width: 992px) {
                        .details-grid { grid-template-columns: 1fr !important; }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default HostelDetail;
