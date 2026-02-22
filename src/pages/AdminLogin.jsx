
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
            background: '#0f172a', /* Deep navy background */
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '32px',
                padding: '48px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animation: 'fadeIn 0.8s ease-out'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '20px',
                        background: isOwnerLogin ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.3)'
                    }}>
                        {isOwnerLogin ? <Building2 size={36} /> : <ShieldCheck size={36} />}
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                        {isOwnerLogin ? 'Owner Portal' : 'Admin Nexus'}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '16px' }}>
                        {isOwnerLogin ? 'Property Management Login' : 'Secure Administrative Access'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171',
                        padding: '14px',
                        borderRadius: '16px',
                        marginBottom: '24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
                        <input
                            type="email"
                            placeholder="Admin ID / Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                borderRadius: '16px',
                                background: 'rgba(15, 23, 42, 0.5)',
                                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
                        <input
                            type="password"
                            placeholder="Encryption Key / Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                borderRadius: '16px',
                                background: 'rgba(15, 23, 42, 0.5)',
                                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button type="submit" disabled={loading || googleLoading} style={{
                        background: 'white',
                        color: '#0f172a',
                        padding: '16px',
                        borderRadius: '16px',
                        fontSize: '16px',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'all 0.2s ease'
                    }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>Initialize Session <ArrowRight size={20} /></>}
                    </button>
                </form>

                <div style={{ position: 'relative', margin: '32px 0', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'rgba(255, 255, 255, 0.1)', zIndex: '1' }}></div>
                    <span style={{ position: 'relative', zIndex: '2', background: '#1e293b', padding: '0 16px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>OR</span>
                </div>

                <button onClick={handleGoogleLogin} disabled={loading || googleLoading} style={{
                    width: '100%',
                    background: 'transparent',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: '1.5px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                }}>
                    {googleLoading ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Verify with Google Admin
                        </>
                    )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '16px' }}>
                        New here? <Link to={`/signup?role=${isOwnerLogin ? 'owner' : 'admin'}`} style={{ color: isOwnerLogin ? '#10b981' : '#60a5fa', textDecoration: 'none', fontWeight: '700' }}>Create an account</Link>
                    </p>
                    <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s ease' }}>
                        Not {isOwnerLogin ? 'an Owner' : 'an Admin'}? <span style={{ color: '#60a5fa', textDecoration: 'underline' }}>Main Portal</span>
                    </Link>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                input:focus {
                    border-color: rgba(255, 255, 255, 0.4) !important;
                    background: rgba(15, 23, 42, 0.8) !important;
                    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05) !important;
                }
                button:hover {
                    opacity: 0.95;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                button:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
