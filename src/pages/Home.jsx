
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
        <div>
            {/* Minimal Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                padding: '120px 24px 80px',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.2 }}></div>
                <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--accent)', filter: 'blur(120px)', opacity: 0.2 }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="animate-fade" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>
                        <Sparkles size={16} color="var(--primary-light)" />
                        <span>The smarter way to find student housing</span>
                    </div>

                    <h1 style={{ fontSize: '72px', maxWidth: '900px', margin: '0 auto 24px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                        Find Your <span className="gradient-text">Dream Home</span> Near Campus
                    </h1>

                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '22px', maxWidth: '700px', margin: '0 auto 48px' }}>
                        Verified hostels, instant bookings, and a safe community. Everything you need for the perfect college life.
                    </p>

                    <div className="card animate-fade" style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        padding: '12px',
                        display: 'flex',
                        gap: '12px',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '32px'
                    }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '20px', top: '22px', color: 'var(--text-light)' }} size={24} />
                            <input
                                type="text"
                                placeholder="Where do you want to live? (Area or Hostel Name)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    paddingLeft: '60px',
                                    height: '68px',
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '18px',
                                    boxShadow: 'none'
                                }}
                            />
                        </div>
                        <button className="btn-primary" style={{ padding: '0 40px', borderRadius: '24px', height: '68px' }}>
                            Search Now
                        </button>
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: '80px 32px' }}>
                {/* Dashboard Previews for Logged In Users */}
                {user && (
                    <div className="animate-fade" style={{
                        background: 'white',
                        padding: '32px',
                        borderRadius: '32px',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '64px',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '20px',
                                background: user.role === 'admin' ? '#1e293b' : 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                {user.role === 'admin' ? <ShieldCheck size={32} /> : <Building2 size={32} />}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Hey {user.name}, welcome back!</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
                                    {user.role === 'admin' ? 'Manage your property fleet' : 'Manage your stays and explore more'}
                                </p>
                            </div>
                        </div>
                        <Link
                            to={user.role === 'admin' ? '/admin' : '/my-bookings'}
                            className="btn-outline"
                            style={{ borderRadius: '20px', fontSize: '16px' }}
                        >
                            Open Dashboard <ArrowRight size={18} />
                        </Link>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>Available Listings</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Explore {filteredHostels.length} unique properties</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="badge badge-blue">All</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '40px' }}>
                    {filteredHostels.map(hostel => (
                        <Link key={hostel.id} to={`/hostel/${hostel.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card animate-fade">
                                <div style={{ position: 'relative', height: '300px' }}>
                                    <img
                                        src={(hostel.images && hostel.images.length > 0) ? hostel.images[0] : 'https://images.unsplash.com/photo-1555854817-5b2738a7528d?auto=format&fit=crop&w=800&q=80'}
                                        alt={hostel.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854817-5b2738a7528d?auto=format&fit=crop&w=800&q=80' }}
                                    />
                                    <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                                        <div className="glass" style={{ padding: '6px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                                            {hostel.distance}
                                        </div>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '0',
                                        right: '0',
                                        padding: '40px 20px 20px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                                            <div>
                                                <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{hostel.name}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9, fontSize: '15px' }}>
                                                    <MapPin size={14} /> {hostel.location}
                                                </div>
                                            </div>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backdropFilter: 'blur(5px)'
                                            }}>
                                                <Heart size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                                        {hostel.amenities.slice(0, 3).map(amt => (
                                            <span key={amt} className="badge badge-blue" style={{ fontSize: '13px' }}>{amt}</span>
                                        ))}
                                        {hostel.amenities.length > 3 && <span className="badge" style={{ background: '#f1f5f9', fontSize: '13px' }}>+{hostel.amenities.length - 3}</span>}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Starts from</div>
                                            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>₹{hostel.price}<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '400' }}>/mo</span></div>
                                        </div>
                                        <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: '16px', fontSize: '15px' }}>
                                            Book Room
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredHostels.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-muted)', background: 'var(--bg-subtle)', borderRadius: '40px', marginTop: '40px' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: 'var(--shadow)'
                        }}>
                            <Search size={48} color="var(--border)" />
                        </div>
                        <h3 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--text-main)' }}>No properties match your search</h3>
                        <p style={{ fontSize: '18px' }}>Try searching with a different keyword or browse all properties.</p>
                        <button
                            onClick={() => setSearch('')}
                            className="btn-outline"
                            style={{ marginTop: '24px', borderRadius: '20px' }}
                        >
                            Reset Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
