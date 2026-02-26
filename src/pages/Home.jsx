
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/storage';
import { getHostels } from '../utils/firebaseService';
import { MapPin, Navigation, Info, Sparkles, Search, ArrowRight, Building2, ShieldCheck, Heart } from 'lucide-react';

const Home = () => {
    const [hostels, setHostels] = useState([]);
    const [search, setSearch] = useState('');
    const user = getCurrentUser();

    useEffect(() => {
        const fetchHostels = async () => {
            const data = await getHostels();
            setHostels(data);
        };
        fetchHostels();
    }, []);

    const filteredHostels = hostels.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ background: 'var(--bg)' }}>
            {/* Immersive Hero Section */}
            <section style={{
                position: 'relative',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '160px 24px 100px',
                background: 'var(--bg-dark)',
                color: 'white',
                overflow: 'hidden'
            }}>
                {/* Visual Depth Elements */}
                <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '50%', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', filter: 'blur(150px)', opacity: 0.3 }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '50%', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', filter: 'blur(150px)', opacity: 0.3 }}></div>

                {/* Floating Shapes for Dynamism */}
                <div className="animate-fade" style={{ position: 'absolute', top: '20%', right: '15%', width: '120px', height: '120px', borderRadius: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', transform: 'rotate(15deg)' }}></div>
                <div className="animate-fade animate-delay-2" style={{ position: 'absolute', bottom: '25%', left: '10%', width: '80px', height: '80px', borderRadius: '25px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', transform: 'rotate(-10deg)' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <div className="animate-fade" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'rgba(255,255,255,0.08)',
                        padding: '10px 24px',
                        borderRadius: '100px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '32px',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                            <Sparkles size={14} color="white" />
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.02em' }}>OVER 5,000+ STUDENTS TRUST US</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(48px, 6vw, 84px)',
                        maxWidth: '1000px',
                        margin: '0 auto 32px',
                        lineHeight: 1.05,
                        fontWeight: 900
                    }}>
                        Find Your Perfect <span className="gradient-text">Living Space</span> Near Campus
                    </h1>

                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 'clamp(18px, 1.5vw, 22px)',
                        maxWidth: '750px',
                        margin: '0 auto 56px',
                        lineHeight: 1.6
                    }}>
                        Verified student housing with zero brokerage. Join thousands of students living in the safest and most vibrant communities.
                    </p>

                    {/* Advanced Search Bar */}
                    <div className="animate-fade animate-delay-1" style={{
                        maxWidth: '850px',
                        margin: '0 auto',
                        background: 'rgba(255,255,255,0.98)',
                        padding: '12px',
                        borderRadius: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,1)'
                    }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '24px' }}>
                            <Search size={22} color="var(--text-light)" />
                            <input
                                type="text"
                                placeholder="Enter area, college or hostel name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '18px',
                                    padding: '18px 16px',
                                    boxShadow: 'none',
                                    fontWeight: '500',
                                    color: 'var(--text-main)'
                                }}
                            />
                        </div>
                        <button className="btn-primary" style={{ height: '64px', borderRadius: '20px', padding: '0 48px', fontSize: '18px' }}>
                            Search
                        </button>
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: '100px 2rem' }}>
                {/* User Context Card */}
                {user && (
                    <div className="animate-fade" style={{
                        background: 'var(--bg-subtle)',
                        padding: '40px',
                        borderRadius: '32px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '32px',
                        marginBottom: '80px',
                        border: '1px solid var(--border-light)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '24px',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)',
                                boxShadow: 'var(--shadow-md)',
                                fontSize: '32px'
                            }}>
                                {user.role === 'admin' ? <ShieldCheck size={36} /> : <Building2 size={36} />}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.02em' }}>Welcome back, {user.name.split(' ')[0]}!</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500' }}>
                                    {(user.role === 'admin' || user.role === 'owner') ? 'Property Management Dashboard' : 'Your bookings and saved hostels'}
                                </p>
                            </div>
                        </div>
                        <Link
                            to={(user.role === 'admin' || user.role === 'owner') ? '/admin' : '/my-bookings'}
                            className="btn btn-primary"
                            style={{ padding: '16px 36px', borderRadius: '18px' }}
                        >
                            Visit Dashboard <ArrowRight size={20} />
                        </Link>
                    </div>
                )}

                {/* Section Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px' }}>
                    <div>
                        <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Curated Spaces</div>
                        <h2 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: '900', letterSpacing: '-0.03em' }}>Available Properties</h2>
                    </div>
                    <div className="glass" style={{ padding: '8px 24px', borderRadius: '100px', fontSize: '15px', fontWeight: '700', color: 'var(--primary)', border: '1.5px solid var(--primary-light)' }}>
                        {filteredHostels.length} hostels found
                    </div>
                </div>

                {/* Grid of Hostels */}
                <div className="grid grid-3">
                    {filteredHostels.map((hostel, idx) => (
                        <Link
                            key={hostel.id}
                            to={`/hostel/${hostel.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            className={`animate-fade animate-delay-${(idx % 3) + 1}`}
                        >
                            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
                                    <img
                                        src={(hostel.images && hostel.images.length > 0) ? hostel.images[0] : 'https://images.unsplash.com/photo-1555854817-5b2738a7528d?auto=format&fit=crop&w=800&q=80'}
                                        alt={hostel.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                        className="hostel-img"
                                    />
                                    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 5 }}>
                                        <div className="glass" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                            {hostel.distance || '0.5 km'}
                                        </div>
                                    </div>
                                    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 5 }}>
                                        <button style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.9)', color: 'var(--secondary)', borderRadius: '14px', padding: 0 }}>
                                            <Heart size={20} fill={idx === 0 ? 'currentColor' : 'none'} />
                                        </button>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '0',
                                        right: '0',
                                        padding: '60px 24px 24px',
                                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 100%)',
                                        color: 'white'
                                    }}>
                                        <h3 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.02em' }}>{hostel.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8, fontSize: '15px' }}>
                                            <MapPin size={16} /> {hostel.location}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
                                        {hostel.amenities.slice(0, 3).map(amt => (
                                            <span key={amt} className="badge badge-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>{amt}</span>
                                        ))}
                                        {hostel.amenities.length > 3 && <span className="badge" style={{ background: '#f1f5f9', fontSize: '12px' }}>+{hostel.amenities.length - 3}</span>}
                                    </div>

                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
                                        <div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Starting at</div>
                                            <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'baseline' }}>
                                                ₹{hostel.price}
                                                <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500', marginLeft: '2px' }}> /mo</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary" style={{ padding: '14px 24px', borderRadius: '16px' }}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredHostels.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px 40px', color: 'var(--text-muted)', background: 'var(--bg-subtle)', borderRadius: '48px', marginTop: '60px' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '40px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px',
                            boxShadow: 'var(--shadow-md)',
                            color: 'var(--border)'
                        }}>
                            <Search size={56} />
                        </div>
                        <h3 style={{ fontSize: '28px', marginBottom: '12px', color: 'var(--text-main)', fontWeight: '800' }}>No hostels match your search</h3>
                        <p style={{ fontSize: '18px', maxWidth: '500px', margin: '0 auto 32px' }}>We couldn't find any properties matching "{search}". Try searching for another location or hostel name.</p>
                        <button
                            onClick={() => setSearch('')}
                            className="btn btn-outline"
                            style={{ padding: '16px 40px' }}
                        >
                            Explore All Properties
                        </button>
                    </div>
                )}
            </div>

            {/* Why Choose Us Section */}
            <section style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '44px', fontWeight: '900', marginBottom: '16px' }}>Why <span className="gradient-text">HostelHive</span>?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '20px', maxWidth: '600px', margin: '0 auto' }}>We handle the hard part so you can focus on your studies.</p>
                    </div>
                    <div className="grid grid-3">
                        {[
                            { icon: <ShieldCheck size={32} />, title: 'Verified Profiles', desc: 'Every property goes through a 15-point verification check.' },
                            { icon: <Navigation size={32} />, title: 'Near Campus', desc: 'All hostels are within walking distance to major universities.' },
                            { icon: <Sparkles size={32} />, title: 'Instant Booking', desc: 'Book your room in under 2 minutes with simple digital paperwork.' }
                        ].map((item, i) => (
                            <div key={i} className="card" style={{ padding: '48px', background: 'white' }}>
                                <div style={{ color: 'var(--primary)', marginBottom: '24px' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
