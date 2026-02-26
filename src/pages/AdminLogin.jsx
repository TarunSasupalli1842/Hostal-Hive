
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { adminLogin, googleLogin, ownerLogin } from '../utils/firebaseService';
import { setCurrentUser } from '../utils/storage';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Building2, Sparkles } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isOwnerLogin = queryParams.get('role') === 'owner';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let user;
            if (isOwnerLogin) {
                user = await ownerLogin(email, password);
            } else {
                user = await adminLogin(email, password);
            }

            if (user) {
                setCurrentUser(user);
                onLogin(user);
                navigate('/admin');
            } else {
                setError(isOwnerLogin ? 'Invalid owner credentials' : 'Invalid administrative credentials');
            }
        } catch (err) {
            console.error(err);
            setError('System authentication error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            const adminUser = await googleLogin('admin');
            if (adminUser) {
                setCurrentUser(adminUser);
                onLogin(adminUser);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.message || 'Administrative Google authentication failed.');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0f1d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Visual background flares */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '50%', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.1 }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '50%', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.1 }}></div>

            <div className="animate-fade" style={{
                width: '100%',
                maxWidth: '480px',
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: '40px',
                padding: '56px',
                boxShadow: '0 40px 80px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                zIndex: 10,
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '24px',
                            background: isOwnerLogin ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                            color: 'white'
                        }}>
                            {isOwnerLogin ? <Building2 size={40} /> : <ShieldCheck size={40} />}
                        </div>
                    </div>
                    <h2 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '12px', letterSpacing: '-0.04em' }}>
                        {isOwnerLogin ? 'Owner Portal' : 'Admin Nexus'}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '17px', fontWeight: '500' }}>
                        {isOwnerLogin ? 'Manage your property fleet' : 'Secure administrative access'}
                    </p>
                </div>

                {error && (
                    <div className="animate-fade" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '16px', borderRadius: '18px', marginBottom: '32px', fontSize: '14px', fontWeight: '750', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ paddingLeft: '56px', height: '64px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.5)', border: '2px solid rgba(255, 255, 255, 0.05)', color: 'white' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ paddingLeft: '56px', height: '64px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.5)', border: '2px solid rgba(255, 255, 255, 0.05)', color: 'white' }}
                        />
                    </div>

                    <button type="submit" disabled={loading || googleLoading} className="btn-primary" style={{ height: '68px', borderRadius: '20px', fontSize: '17px', fontWeight: '800', background: 'white', color: '#0a0f1d' }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>Initialize Session <ArrowRight size={20} /></>}
                    </button>
                </form>

                <div style={{ position: 'relative', margin: '40px 0', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'rgba(255, 255, 255, 0.1)', zIndex: '1' }}></div>
                    <span style={{ position: 'relative', zIndex: '2', background: '#24324d', padding: '0 20px', color: '#64748b', fontSize: '13px', fontWeight: '800', letterSpacing: '0.05em' }}>OR CONTINUE WITH</span>
                </div>

                <button onClick={handleGoogleLogin} disabled={loading || googleLoading} className="btn-outline" style={{ width: '100%', height: '64px', borderRadius: '20px', gap: '14px', border: '2px solid rgba(255, 255, 255, 0.1)', color: 'white' }}>
                    {googleLoading ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span style={{ fontWeight: '750' }}>Google Workspace</span>
                        </>
                    )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ fontSize: '15px', color: '#94a3b8', fontWeight: '600' }}>
                        Don't have an account? <Link to={`/signup?role=${isOwnerLogin ? 'owner' : 'admin'}`} style={{ color: isOwnerLogin ? '#10b981' : 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>Register Now</Link>
                    </p>
                    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', fontWeight: '800', letterSpacing: '0.04em' }}>
                            STUDENT? <span style={{ color: 'var(--primary)' }}>GO TO HOME</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
