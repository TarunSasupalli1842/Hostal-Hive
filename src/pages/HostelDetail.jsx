
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Wifi, Home as HomeIcon, Coffee, Shirt, Shield, CheckCircle, ArrowLeft, Star, Share2, MapPin, Navigation, MessageSquare, Send, Heart, Info, Users, Zap, X, Phone } from 'lucide-react';
import { getCurrentUser } from '../utils/storage';
import { submitRating, getHostelRatings, getOwnerDetails } from '../utils/firebaseService';

const AMENITY_ICONS = {
    "WiFi": <Wifi size={22} />,
    "Food": <Coffee size={22} />,
    "Laundry": <Shirt size={22} />,
    "Security": <Shield size={22} />,
    "Study Room": <CheckCircle size={22} />,
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
    const [owner, setOwner] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [fetchingOwner, setFetchingOwner] = useState(false);

    const fetchDetails = async () => {
        const hostelRef = doc(db, 'hostels', id);
        const hostelSnap = await getDoc(hostelRef);

        if (hostelSnap.exists()) {
            const hostelData = { id: hostelSnap.id, ...hostelSnap.data() };
            setHostel(hostelData);

            const q = query(collection(db, 'rooms'), where("hostelId", "==", id));
            const roomsSnap = await getDocs(q);
            const allRooms = roomsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            setRooms(allRooms.filter(room => room.available > 0));

            const ratings = await getHostelRatings(id);
            setReviews(ratings);

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
        window.scrollTo(0, 0);
    }, [id]);

    const handleContactManager = async () => {
        if (!hostel.ownerId) {
            alert("No manager details available for this property.");
            return;
        }

        setFetchingOwner(true);
        try {
            const data = await getOwnerDetails(hostel.ownerId);
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-subtle)' }}>
            <div className="animate-spin" style={{ width: '60px', height: '60px', border: '6px solid rgba(99, 102, 241, 0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-subtle)', paddingBottom: '100px' }}>
            {/* Elegant Header Area */}
            <div style={{ background: 'white', borderBottom: '1px solid var(--border-light)', paddingTop: '110px', paddingBottom: '40px' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <button onClick={() => navigate(-1)} className="btn glass" style={{ padding: '12px 24px', borderRadius: '14px', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '15px' }}>
                            <ArrowLeft size={18} /> Back
                        </button>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="glass" style={{ width: '48px', height: '48px', borderRadius: '14px', border: '1px solid var(--border-light)', padding: 0 }}><Share2 size={20} /></button>
                            <button className="glass" style={{ width: '48px', height: '48px', borderRadius: '14px', border: '1px solid var(--border-light)', padding: 0 }}><Heart size={20} /></button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <span className="badge badge-primary" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}>Professional Managed</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: '700', color: '#f59e0b' }}>
                                    <Star size={16} fill="#f59e0b" /> {hostel.rating || 'New'}
                                </div>
                            </div>
                            <h1 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '12px' }}>{hostel.name}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'var(--text-muted)', fontSize: '16px', fontWeight: '500' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="var(--primary)" /> {hostel.location}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Navigation size={18} color="var(--accent)" /> {hostel.distance || '0.5 km from campus'}</div>
                            </div>
                        </div>
                        <div className="card" style={{ padding: '24px 40px', background: 'var(--bg-dark)', color: 'white', borderRadius: '24px' }}>
                            <div style={{ opacity: 0.6, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Starting Price</div>
                            <div style={{ fontSize: '36px', fontWeight: '900' }}>₹{hostel.price}<span style={{ fontSize: '16px', opacity: 0.6, fontWeight: '500' }}>/mo</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '50px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.6fr)', gap: '48px' }} className="details-grid">
                    <div>
                        {/* Main Image Gallery */}
                        <div className="card animate-fade" style={{ height: '550px', borderRadius: '32px', marginBottom: '24px', background: '#e2e8f0' }}>
                            <img
                                src={hostel.images?.[activeImg] || 'https://images.unsplash.com/photo-1555854817-5b2738a7528d?auto=format&fit=crop&w=800&q=80'}
                                alt={hostel.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '56px', overflowX: 'auto', padding: '4px' }}>
                            {(hostel.images || ['https://images.unsplash.com/photo-1555854817-5b2738a7528d?auto=format&fit=crop&w=800&q=80']).map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImg(idx)}
                                    style={{
                                        minWidth: '130px',
                                        height: '90px',
                                        cursor: 'pointer',
                                        borderRadius: '18px',
                                        overflow: 'hidden',
                                        border: activeImg === idx ? '3px solid var(--primary)' : '3px solid transparent',
                                        transition: 'all 0.3s ease',
                                        boxShadow: activeImg === idx ? '0 8px 20px rgba(99, 102, 241, 0.3)' : 'none'
                                    }}
                                >
                                    <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: activeImg === idx ? 1 : 0.6 }} />
                                </div>
                            ))}
                        </div>

                        {/* About Property */}
                        <div className="card" style={{ padding: '48px', borderRadius: '32px', marginBottom: '48px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Info size={24} />
                                </div>
                                <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>Property Details</h2>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '19px', lineHeight: '1.8', marginBottom: '48px' }}>
                                {hostel.description}
                            </p>

                            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '28px' }}>Amenities Included</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                                {(Array.isArray(hostel.amenities) ? hostel.amenities : (hostel.amenities?.split(',') || [])).map((amenity, idx) => {
                                    const name = amenity?.trim?.() || (typeof amenity === 'string' ? amenity : '');
                                    if (!name) return null;
                                    return (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            padding: '24px',
                                            background: 'var(--bg-subtle)',
                                            borderRadius: '24px',
                                            border: '1px solid var(--border-light)',
                                            transition: 'transform 0.3s ease'
                                        }} className="hover-lift">
                                            <div style={{ color: 'var(--primary)', background: 'white', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                                {AMENITY_ICONS[name] || <Zap size={22} />}
                                            </div>
                                            <span style={{ fontWeight: '750', color: 'var(--text-main)', fontSize: '16px' }}>{name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rooms Section */}
                        <div id="rooms" style={{ marginBottom: '80px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={24} />
                                </div>
                                <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>Available Room Types</h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {rooms.map(room => (
                                    <div key={room.id} className="card" style={{ display: 'flex', overflow: 'hidden', height: '240px' }}>
                                        <div style={{ width: '320px', minWidth: '320px' }}>
                                            <img src={room.image || 'https://images.unsplash.com/photo-1522771739844-6a9fb69e2b87?auto=format&fit=crop&w=800&q=80'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>{room.type}</h3>
                                                    <div className="badge badge-primary" style={{ background: '#ecfdf5', color: '#059669', fontSize: '11px' }}>{room.available} Slots Available</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>₹{room.price}</div>
                                                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>per student / mo</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                                                        <Users size={16} /> Up to {room.capacity} students
                                                    </div>
                                                </div>
                                                <Link to={`/room/${room.id}`} className="btn-primary" style={{ height: '54px', padding: '0 32px', borderRadius: '14px' }}>
                                                    Select Room
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="card" style={{ padding: '48px', borderRadius: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                <h2 style={{ fontSize: '32px', fontWeight: '900' }}>Community Reviews</h2>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                        <Star size={28} fill="#f59e0b" /> {hostel.rating || '0.0'}
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>based on {hostel.ratingCount || 0} students</div>
                                </div>
                            </div>

                            {user && user.role === 'student' && (
                                <div style={{ background: 'var(--bg-subtle)', padding: '32px', borderRadius: '28px', marginBottom: '48px', border: '1px solid var(--border-light)' }}>
                                    <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>What's your experience?</h4>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={36}
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
                                        style={{ height: '140px', background: 'white', marginBottom: '24px', borderRadius: '20px' }}
                                    />
                                    <button
                                        className="btn-primary"
                                        onClick={handleRatingSubmit}
                                        disabled={submitting}
                                        style={{ height: '60px', width: '220px', borderRadius: '18px' }}
                                    >
                                        {submitting ? 'Submitting...' : 'Post My Review'}
                                    </button>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {reviews.length > 0 ? reviews.map(review => (
                                    <div key={review.id} style={{ padding: '32px', background: 'var(--bg-subtle)', borderRadius: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                                    {(review.studentName || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '800', fontSize: '17px' }}>{review.studentName || 'Anonymous Student'}</div>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Verified Student • {review.date}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={review.rating >= s ? "#f59e0b" : "none"} color="#f59e0b" />)}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', fontStyle: 'italic' }}>"{review.comment || 'No comment provided.'}"</p>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'var(--bg-subtle)', borderRadius: '32px' }}>
                                        <MessageSquare size={56} style={{ marginBottom: '20px', opacity: 0.2 }} />
                                        <h4 style={{ fontWeight: '800', fontSize: '18px' }}>No reviews yet</h4>
                                        <p>Be the first to share your experience staying here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Booking Sidebar */}
                    <div>
                        <div style={{ position: 'sticky', top: '110px' }}>
                            <div className="card" style={{ padding: '40px', borderRadius: '32px', boxShadow: 'var(--shadow-lg)' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '24px' }}>Book Your Spot</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
                                    Secure your room instantly. High demand area, rooms are filling fast for this semester.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                    {[
                                        { title: 'Refund Policy', desc: 'Secure booking refund' },
                                        { title: 'Visit Scheduled', desc: 'Free physical visits' },
                                        { title: 'Check-in', desc: 'Instant keys on arrive' }
                                    ].map((benefit, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ color: '#16a34a' }}><CheckCircle size={18} /></div>
                                            <div>
                                                <div style={{ fontWeight: '750', fontSize: '14px' }}>{benefit.title}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{benefit.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <a href="#rooms" className="btn-primary" style={{ width: '100%', height: '68px', borderRadius: '20px', fontSize: '18px' }}>
                                    See Room Pricing
                                </a>

                                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                    <button
                                        onClick={handleContactManager}
                                        disabled={fetchingOwner}
                                        className="btn glass"
                                        style={{ width: '100%', height: '56px', borderRadius: '16px', border: '1px solid var(--border-light)' }}
                                    >
                                        {fetchingOwner ? 'Fetching...' : 'Contact Manager'}
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', padding: '24px', background: 'var(--bg-dark)', color: 'white', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
                                    <Shield size={24} color="#34d399" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '15px' }}>Price Guarantee</div>
                                    <div style={{ fontSize: '13px', opacity: 0.6 }}>No hidden admin fees</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                .hover-lift:hover { transform: translateY(-5px); border-color: var(--primary) !important; }
                @media (max-width: 992px) {
                    .details-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default HostelDetail;
