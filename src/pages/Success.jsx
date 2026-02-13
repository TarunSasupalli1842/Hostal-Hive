
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';

const Success = () => {
    return (
        <div className="theme-rose" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <div className="container" style={{ padding: '130px 16px 80px', textAlign: 'center' }}>
                <div className="animate-fade" style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '64px', borderRadius: '40px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)' }}>
                    <div style={{ color: '#22c55e', marginBottom: '32px' }}>
                        <CheckCircle size={100} strokeWidth={1.5} />
                    </div>
                    <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1.5px' }}>Booking Confirmed!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '20px', marginBottom: '48px', lineHeight: '1.6' }}>
                        Congratulations! Your room has been successfully reserved. You can find all your receipt and stay details in your personal dashboard.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Link to="/my-bookings" className="btn-primary" style={{ textDecoration: 'none', height: '64px', borderRadius: '20px', fontSize: '18px' }}>
                            <Calendar size={22} /> Go to My Bookings
                        </Link>
                        <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px', marginTop: '16px' }}>
                            Explore More Places <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;
