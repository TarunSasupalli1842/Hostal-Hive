
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCurrentUser } from '../utils/storage';
import { studentLogin as fbLogin, googleLogin } from '../utils/firebaseService';
import { User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const StudentLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const student = await fbLogin(email, password);
            if (student) {
                setCurrentUser(student);
                onLogin(student);
                navigate('/');
            } else {
                setError('Invalid student credentials');
            }
        } catch (err) {
            setError('Login error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            const student = await googleLogin('student');
            if (student) {
                setCurrentUser(student);
                onLogin(student);
                navigate('/');
            }
        } catch (err) {
            setError('Google login failed: ' + err.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '32px',
                padding: '48px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'slideUp 0.6s ease-out'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.5)'
                    }}>
                        <User size={32} />
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', marginBottom: '8px', letterSpacing: '-0.5px' }}>Welcome Back</h2>
                    <p style={{ color: '#6b7280', fontSize: '16px' }}>Sign in to continue to Hostal-Hive</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        padding: '14px',
                        borderRadius: '16px',
                        marginBottom: '24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        border: '1px solid #fee2e2',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                borderRadius: '16px',
                                border: '1.5px solid #e5e7eb',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                borderRadius: '16px',
                                border: '1.5px solid #e5e7eb',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button type="submit" disabled={loading || googleLoading} style={{
                        background: '#1f2937',
                        color: 'white',
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
                        transition: 'all 0.2s ease',
                        marginTop: '8px'
                    }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>Sign In <ArrowRight size={20} /></>}
                    </button>
                </form>

                <div style={{ position: 'relative', margin: '32px 0', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: '#e5e7eb', zIndex: '1' }}></div>
                    <span style={{ position: 'relative', zIndex: '2', background: 'white', padding: '0 16px', color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>OR CONTINUE WITH</span>
                </div>

                <button onClick={handleGoogleLogin} disabled={loading || googleLoading} style={{
                    width: '100%',
                    background: 'white',
                    color: '#374151',
                    padding: '16px',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: '1.5px solid #e5e7eb',
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
                            Google
                        </>
                    )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '16px' }}>
                        New here? <Link to="/signup?role=student" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '700' }}>Create an account</Link>
                    </p>
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
                        <Link to="/login" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Looking for another portal? <span style={{ color: '#1f2937', fontWeight: '700' }}>Switch Portal</span>
                        </Link>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                input:focus {
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
                }
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                button:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default StudentLogin;
