
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCurrentUser } from '../utils/storage';
import { studentSignup as fbSignup } from '../utils/firebaseService';
import { UserPlus, Sparkles, User, Mail, School, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Signup = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        college: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const newUser = { ...formData, role: 'student' };
            const student = await fbSignup(newUser);
            setCurrentUser(student);
            onLogin(student);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="theme-rose" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px'
        }}>
            <div className="card animate-fade" style={{ width: '100%', maxWidth: '700px', padding: '64px 48px', background: 'white', borderRadius: '40px' }}>
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
                        <UserPlus size={40} />
                    </div>
                    <div className="gradient-text" style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Start Your Journey</div>
                    <h2 style={{ fontSize: '42px', marginBottom: '12px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Join the community and find your next home.</p>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '20px', top: '20px', color: 'var(--text-light)' }} size={20} />
                            <input name="name" placeholder="Full Name" onChange={handleChange} required style={{ paddingLeft: '56px' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Phone style={{ position: 'absolute', left: '20px', top: '20px', color: 'var(--text-light)' }} size={20} />
                            <input name="phone" placeholder="Phone Number" onChange={handleChange} required style={{ paddingLeft: '56px' }} />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '20px', top: '20px', color: 'var(--text-light)' }} size={20} />
                        <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required style={{ paddingLeft: '56px' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <School style={{ position: 'absolute', left: '20px', top: '20px', color: 'var(--text-light)' }} size={20} />
                        <input name="college" placeholder="College / University Name" onChange={handleChange} required style={{ paddingLeft: '56px' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '20px', top: '20px', color: 'var(--text-light)' }} size={20} />
                        <input name="password" type="password" placeholder="Secure Password" onChange={handleChange} required style={{ paddingLeft: '56px' }} />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '70px', borderRadius: '24px', fontSize: '20px', marginTop: '16px' }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>Create Account <ArrowRight size={22} /></>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
                        Already part of the hive? <Link to="/student-login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
