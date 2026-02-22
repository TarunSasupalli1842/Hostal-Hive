
import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';

const Login = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px 60px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ maxWidth: '1200px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div className="animate-fade" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                        padding: '10px 24px',
                        borderRadius: '100px',
                        marginBottom: '32px',
                        fontSize: '14px',
                        fontWeight: '700',
                        letterSpacing: '0.05em'
                    }}>
                        <Sparkles size={16} />
                        <span>CHOOSE YOUR PORTAL</span>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(40px, 8vw, 64px)',
                        fontWeight: '900',
                        marginBottom: '20px',
                        letterSpacing: '-0.04em',
                        color: '#1e293b',
                        lineHeight: '1.1'
                    }}>
                        Welcome to <span style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>HostelHive</span>
                    </h1>
                    <p style={{
                        color: '#64748b',
                        fontSize: 'clamp(18px, 2vw, 22px)',
                        maxWidth: '650px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        The smarter way to find and manage student accommodation. Secure your spot today.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    perspective: '1000px'
                }} className="portal-grid">
                    {/* Student Selection */}
                    <Link to="/student-login" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '48px 32px',
                            textAlign: 'center',
                            background: 'white',
                            borderRadius: '40px',
                            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #f1f5f9',
                            height: '100%',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxSizing: 'border-box'
                        }} className="portal-card">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '24px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                boxShadow: '0 20px 30px -10px rgba(99, 102, 241, 0.5)'
                            }}>
                                <User size={40} />
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: '#1e293b' }}>Student Portal</h2>
                            <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '32px', lineHeight: '1.5' }}>
                                Find your next home, book rooms, and manage stays.
                            </p>
                            <div style={{
                                width: '100%',
                                padding: '16px',
                                background: '#6366f1',
                                color: 'white',
                                borderRadius: '18px',
                                fontWeight: '700',
                                fontSize: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginTop: 'auto'
                            }}>
                                Student Sign In <ArrowRight size={18} />
                            </div>
                        </div>
                    </Link>

                    {/* Owner Selection */}
                    <Link to="/admin-login?role=owner" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '48px 32px',
                            textAlign: 'center',
                            background: 'white',
                            borderRadius: '40px',
                            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #f1f5f9',
                            height: '100%',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxSizing: 'border-box'
                        }} className="portal-card">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '24px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                boxShadow: '0 20px 30px -10px rgba(16, 185, 129, 0.4)'
                            }}>
                                <Building2 size={40} />
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: '#1e293b' }}>Hostel Owner</h2>
                            <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '32px', lineHeight: '1.5' }}>
                                Manage your properties, update rooms, and track bookings.
                            </p>
                            <div style={{
                                width: '100%',
                                padding: '16px',
                                background: '#10b981',
                                color: 'white',
                                borderRadius: '18px',
                                fontWeight: '700',
                                fontSize: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginTop: 'auto'
                            }}>
                                Owner Sign In <ArrowRight size={18} />
                            </div>
                        </div>
                    </Link>

                    {/* Admin Selection */}
                    <Link to="/admin-login" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '48px 32px',
                            textAlign: 'center',
                            background: '#0f172a',
                            borderRadius: '40px',
                            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            height: '100%',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxSizing: 'border-box'
                        }} className="portal-card">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '24px',
                                background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.3)'
                            }}>
                                <ShieldCheck size={40} />
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: 'white' }}>Admin Nexus</h2>
                            <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px', lineHeight: '1.5' }}>
                                Global system settings and user management.
                            </p>
                            <div style={{
                                width: '100%',
                                padding: '16px',
                                background: 'white',
                                color: '#0f172a',
                                borderRadius: '18px',
                                fontWeight: '700',
                                fontSize: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginTop: 'auto'
                            }}>
                                Admin Access <ArrowRight size={18} />
                            </div>
                        </div>
                    </Link>
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p style={{ fontSize: '18px', color: '#64748b' }}>
                        Need a new account? <Link to="/signup" style={{ color: '#6366f1', fontWeight: '800', textDecoration: 'none' }}>Join our community</Link>
                    </p>
                </div>
            </div>
            <style>{`
                .portal-card:hover {
                    transform: translateY(-10px) rotateX(2deg);
                    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.1);
                }
                .portal-card:active {
                    transform: translateY(-5px);
                }
            `}</style>
        </div>
    );
};

export default Login;
