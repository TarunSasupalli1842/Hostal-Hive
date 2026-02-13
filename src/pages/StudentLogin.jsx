
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCurrentUser } from '../utils/storage';
import { studentLogin as fbLogin } from '../utils/firebaseService';
import { User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const StudentLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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

    return (
        <div className="theme-rose" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '130px 24px 60px'
        }}>
            <div className="card animate-fade" style={{ width: '100%', maxWidth: '500px', padding: '64px 48px', background: 'white', borderRadius: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '24px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <User size={40} />
                    </div>
                    <h2 style={{ fontSize: '36px', marginBottom: '12px' }}>Student Login</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Enter your credentials to manage your stays.</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(244, 63, 94, 0.05)',
                        color: 'var(--secondary)',
                        padding: '16px',
                        borderRadius: '16px',
                        marginBottom: '32px',
                        textAlign: 'center',
                        fontWeight: '700',
                        border: '1px solid rgba(244, 63, 94, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '20px', top: '20px', color: 'var(--text-light)' }} size={20} />
                        <input
                            type="email"
                            placeholder="Student Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ paddingLeft: '56px' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '20px', top: '20px', color: 'var(--text-light)' }} size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ paddingLeft: '56px' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '70px', borderRadius: '24px', fontSize: '18px' }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>Sign In <ArrowRight size={20} /></>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>Create One</Link>
                    </p>
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
                        <Link to="/admin-login" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                            ARE YOU AN ADMIN? <span style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>LOGIN HERE</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
