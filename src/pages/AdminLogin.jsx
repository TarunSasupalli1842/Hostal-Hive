
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '../utils/firebaseService';
import { setCurrentUser } from '../utils/storage';
import { ShieldCheck, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const adminUser = await adminLogin(email, password);
            if (adminUser) {
                setCurrentUser(adminUser);
                onLogin(adminUser);
                navigate('/admin');
            } else {
                setError('Invalid admin credentials');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during secure connection establishment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="theme-slate" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
                        background: 'rgba(15, 23, 42, 0.05)',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <ShieldCheck size={40} />
                    </div>
                    <h2 style={{ fontSize: '36px', marginBottom: '12px' }}>Admin Nexus</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Property Management & Operations Portal</p>
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
                            placeholder="Admin Identifier"
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
                            placeholder="Nexus Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ paddingLeft: '56px' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ height: '70px', borderRadius: '24px', fontSize: '18px', background: '#0f172a' }} disabled={loading}>
                        {loading ? 'Establishing Connection...' : 'Establish Connection'} <ArrowRight size={20} />
                    </button>
                </form>


                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <Link to="/login" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
                        NOT AN ADMIN? <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>STUDENT LOGIN</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
