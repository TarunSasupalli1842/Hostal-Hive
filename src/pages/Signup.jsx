
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { setCurrentUser } from '../utils/storage';
import { studentSignup as fbSignup, ownerSignup } from '../utils/firebaseService';
import { UserPlus, User, Mail, School, Phone, Lock, ArrowRight, Loader2, Sparkles, Building2 } from 'lucide-react';

const Signup = ({ onLogin }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') || 'student';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        college: '',
        phone: '',
        role: initialRole
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let user;
            if (formData.role === 'owner') {
                user = await ownerSignup(formData);
            } else {
                user = await fbSignup(formData);
            }
            setCurrentUser(user);
            onLogin(user);
            navigate(user.role === 'owner' ? '/admin' : '/');
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
        <div style={{
            minHeight: '100vh',
            background: '#0a0f1d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 24px 80px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Visual background flares */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '50%', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.1 }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '50%', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.1 }}></div>

            <div className="animate-fade" style={{
                width: '100%',
                maxWidth: '680px',
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '40px',
                padding: '56px',
                boxShadow: '0 40px 80px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                        <div style={{ background: 'white', padding: '8px', borderRadius: '18px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--border-light)' }}>
                            <img src="/logo.png" alt="HostelHive" style={{ height: '52px', width: 'auto' }} />
                        </div>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: '800', marginBottom: '20px', letterSpacing: '0.04em' }}>
                        <Sparkles size={14} /> JOIN THE HIVE COMMUNITY
                    </div>
                    <h2 style={{ fontSize: '40px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '-0.04em' }}>Create Your Account</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '17px', fontWeight: '500' }}>Your journey to a perfect student life starts here.</p>
                </div>

                {error && (
                    <div className="animate-fade" style={{ background: '#fef2f2', color: '#dc2626', padding: '16px', borderRadius: '18px', marginBottom: '32px', fontSize: '14px', fontWeight: '750', border: '1px solid #fee2e2', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {/* Role Switcher */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'student' })}
                        style={{
                            flex: 1,
                            height: '64px',
                            borderRadius: '20px',
                            border: formData.role === 'student' ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                            background: formData.role === 'student' ? 'rgba(99, 102, 241, 0.04)' : 'transparent',
                            color: formData.role === 'student' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: '800',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        <User size={20} /> I'm a Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'owner' })}
                        style={{
                            flex: 1,
                            height: '64px',
                            borderRadius: '20px',
                            border: formData.role === 'owner' ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                            background: formData.role === 'owner' ? 'rgba(99, 102, 241, 0.04)' : 'transparent',
                            color: formData.role === 'owner' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: '800',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        <Building2 size={20} /> I'm an Owner
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={20} />
                            <input
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ paddingLeft: '56px', height: '64px', borderRadius: '20px', background: 'var(--bg-subtle)' }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Phone style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={20} />
                            <input
                                name="phone"
                                placeholder="WhatsApp Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                style={{ paddingLeft: '56px', height: '64px', borderRadius: '20px', background: 'var(--bg-subtle)' }}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={20} />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ paddingLeft: '56px', height: '64px', borderRadius: '20px', background: 'var(--bg-subtle)' }}
                        />
                    </div>

                    {formData.role === 'student' && (
                        <div style={{ position: 'relative' }}>
                            <School style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={20} />
                            <input
                                name="college"
                                placeholder="University / College Name"
                                value={formData.college}
                                onChange={handleChange}
                                required
                                style={{ paddingLeft: '56px', height: '64px', borderRadius: '20px', background: 'var(--bg-subtle)' }}
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={20} />
                        <input
                            name="password"
                            type="password"
                            placeholder="Secure Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ paddingLeft: '56px', height: '64px', borderRadius: '20px', background: 'var(--bg-subtle)' }}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ height: '72px', borderRadius: '22px', fontSize: '18px', fontWeight: '800', marginTop: '16px' }}>
                        {loading ? <Loader2 className="animate-spin" size={26} /> : <>Create Account <ArrowRight size={22} /></>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
                    <p style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>Sign In here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
