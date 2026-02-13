
import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
    return (
        <div className="theme-rose" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '130px 24px 60px'
        }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div className="animate-fade" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '8px 20px', borderRadius: '30px', marginBottom: '24px', fontSize: '14px', fontWeight: '800' }}>
                        <Sparkles size={16} />
                        <span>JOIN THE COMMUNITY</span>
                    </div>
                    <h1 style={{ fontSize: '56px', marginBottom: '16px', letterSpacing: '-1.5px' }}>Welcome to <span className="gradient-text">HostelHive</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '20px', maxWidth: '600px', margin: '0 auto' }}>
                        Your journey to a perfect student life starts here. Choose your portal to continue.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px' }}>
                    {/* Student Selection */}
                    <Link to="/student-login" style={{ textDecoration: 'none' }}>
                        <div className="card animate-fade" style={{ padding: '64px 40px', textAlign: 'center', background: 'white', borderRadius: '40px' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '32px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 32px'
                            }}>
                                <User size={48} />
                            </div>
                            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Student Entry</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px' }}>
                                For residents looking to find, book, and manage their perfect home.
                            </p>
                            <button className="btn-primary" style={{ width: '100%', borderRadius: '24px' }}>
                                Access Student Portal <ArrowRight size={20} />
                            </button>
                        </div>
                    </Link>

                    {/* Admin Selection */}
                    <Link to="/admin-login" style={{ textDecoration: 'none' }}>
                        <div className="card animate-fade" style={{ padding: '64px 40px', textAlign: 'center', background: 'white', borderRadius: '40px' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '32px',
                                background: 'rgba(15, 23, 42, 0.1)',
                                color: '#0f172a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 32px'
                            }}>
                                <ShieldCheck size={48} />
                            </div>
                            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Admin Nexus</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px' }}>
                                For property owners managing listings, bookings and campus operations.
                            </p>
                            <button className="btn-primary" style={{ width: '100%', borderRadius: '24px', background: '#0f172a', boxShadow: '0 4px 15px rgba(15, 23, 42, 0.2)' }}>
                                Access Admin Nexis <ArrowRight size={20} />
                            </button>
                        </div>
                    </Link>
                </div>

                <div style={{ textAlign: 'center', marginTop: '64px' }}>
                    <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>Create a Student Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
