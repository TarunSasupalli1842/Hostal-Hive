
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
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px 60px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '650px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '40px',
                padding: '56px',
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
                        margin: '0 auto 24px',
                        boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)'
                    }}>
                        <UserPlus size={32} />
                    </div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                        padding: '6px 16px',
                        borderRadius: '100px',
                        fontSize: '13px',
                        fontWeight: '700',
                        marginBottom: '16px'
                    }}>
                        <Sparkles size={14} />
                        <span>JOIN THE COMMUNITY</span>
                    </div>
                    <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1f2937', marginBottom: '12px', letterSpacing: '-0.8px' }}>Create Account</h2>
                    <p style={{ color: '#6b7280', fontSize: '16px' }}>Start your journey to finding the perfect home.</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        padding: '16px',
                        borderRadius: '16px',
                        marginBottom: '32px',
                        textAlign: 'center',
                        fontWeight: '600',
                        border: '1px solid #fee2e2'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'student' })}
                        style={{
                            flex: 1,
                            padding: '16px',
                            borderRadius: '16px',
                            border: formData.role === 'student' ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                            background: formData.role === 'student' ? 'rgba(99, 102, 241, 0.05)' : 'white',
                            color: formData.role === 'student' ? '#6366f1' : '#6b7280',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <User size={18} /> Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'owner' })}
                        style={{
                            flex: 1,
                            padding: '16px',
                            borderRadius: '16px',
                            border: formData.role === 'owner' ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                            background: formData.role === 'owner' ? 'rgba(99, 102, 241, 0.05)' : 'white',
                            color: formData.role === 'owner' ? '#6366f1' : '#6b7280',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Building2 size={18} /> Hostel Owner
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                            <input
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 48px',
                                    borderRadius: '16px',
                                    border: '1.5px solid #e5e7eb',
                                    background: 'white',
                                    fontSize: '15px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Phone style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                            <input
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 48px',
                                    borderRadius: '16px',
                                    border: '1.5px solid #e5e7eb',
                                    background: 'white',
                                    fontSize: '15px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                borderRadius: '16px',
                                border: '1.5px solid #e5e7eb',
                                background: 'white',
                                fontSize: '15px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {formData.role !== 'owner' && (
                        <div style={{ position: 'relative' }}>
                            <School style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                            <input
                                name="college"
                                placeholder="College / University Name"
                                value={formData.college}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 48px',
                                    borderRadius: '16px',
                                    border: '1.5px solid #e5e7eb',
                                    background: 'white',
                                    fontSize: '15px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                        <input
                            name="password"
                            type="password"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                borderRadius: '16px',
                                border: '1.5px solid #e5e7eb',
                                background: 'white',
                                fontSize: '15px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={{
                        background: '#1f2937',
                        color: 'white',
                        padding: '18px',
                        borderRadius: '16px',
                        fontSize: '17px',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginTop: '16px',
                        transition: 'all 0.2s ease'
                    }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>Create Account <ArrowRight size={22} /></>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #f3f4f6', paddingTop: '32px' }}>
                    <p style={{ fontSize: '16px', color: '#6b7280' }}>
                        Already part of the hive? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '800' }}>Login here</Link>
                    </p>
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
                    outline: none;
                }
                button:hover {
                    opacity: 0.95;
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    );
};

export default Signup;
