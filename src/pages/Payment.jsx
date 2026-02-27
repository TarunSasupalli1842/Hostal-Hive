
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/storage';
import { addBooking } from '../utils/firebaseService';
import { CreditCard, ShieldCheck, ArrowRight, Loader2, Lock, Zap } from 'lucide-react';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingDetails = location.state?.bookingData;
    const [isProcessing, setIsProcessing] = useState(false);
    const [amount, setAmount] = useState('');
    const user = getCurrentUser();
    const [error, setError] = useState('');

    if (!bookingDetails) {
        navigate('/');
        return null;
    }

    const handlePayment = async (e) => {
        e.preventDefault();

        if (parseFloat(amount) !== parseFloat(bookingDetails.totalAmount)) {
            setError(`Please enter the exact amount: ₹${bookingDetails.totalAmount}`);
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            if (!user) {
                setError("Session expired. Please login again.");
                setIsProcessing(false);
                return;
            }

            const rawBooking = {
                ...bookingDetails,
                studentId: bookingDetails.studentId || user.id || user.email,
                status: 'Confirmed',
                createdAt: new Date().toISOString(),
                studentName: bookingDetails.studentName || user.name || 'Student',
                phone: bookingDetails.phone || user.phone || 'N/A',
            };

            // Firestore rejects undefined values — replace them with null
            const finalBooking = Object.fromEntries(
                Object.entries(rawBooking).map(([k, v]) => [k, v === undefined ? null : v])
            );

            await addBooking(finalBooking);

            setTimeout(() => {
                navigate('/success');
            }, 1000);

        } catch (err) {
            console.error("Payment registration error:", err);
            setIsProcessing(false);
            setError(`Error: ${err.message || "Payment registration failed. Please check your connection."}`);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-subtle)', paddingTop: '120px', paddingBottom: '80px' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '48px', alignItems: 'start' }} className="payment-grid">
                    <div>
                        <div className="card" style={{ padding: '48px', borderRadius: '32px', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>Secure Checkout</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '500' }}>Encryption active • Secure payment protocol</p>
                                </div>
                            </div>

                            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                <div className="input-field">
                                    <label style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'block' }}>Enter Verification Amount (₹)</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', fontSize: '36px', fontWeight: '900', color: 'var(--primary)' }}>₹</div>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            style={{ fontSize: '48px', fontWeight: '900', height: '100px', paddingLeft: '64px', borderRadius: '24px', background: 'var(--bg-subtle)' }}
                                            required
                                        />
                                    </div>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '16px', fontWeight: '500' }}>
                                        To verify your booking, please enter exactly <span style={{ color: 'var(--primary)', fontWeight: '800' }}>₹{bookingDetails.totalAmount}</span>
                                    </p>
                                </div>

                                {error && (
                                    <div className="animate-fade" style={{ background: '#fef2f2', color: '#dc2626', padding: '16px', borderRadius: '16px', fontWeight: '750', fontSize: '14px', border: '1px solid #fee2e2', textAlign: 'center' }}>
                                        {error}
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ padding: '24px', borderRadius: '20px', background: 'white', border: '1.5px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <CreditCard size={24} color="var(--primary)" />
                                        <div style={{ fontSize: '15px', fontWeight: '800' }}>Safe & Encrypted</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Your payment details are never stored on our servers.</div>
                                    </div>
                                    <div style={{ padding: '24px', borderRadius: '20px', background: 'white', border: '1.5px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <Zap size={24} color="var(--accent)" />
                                        <div style={{ fontSize: '15px', fontWeight: '800' }}>Instant Confirmation</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Slots are booked in real-time once payment is verified.</div>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" disabled={isProcessing} style={{ height: '76px', fontSize: '20px', fontWeight: '900', borderRadius: '24px' }}>
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} /> Processing Transaction...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Booking & Pay Now <ArrowRight size={24} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-light)', fontSize: '14px', fontWeight: '600' }}>
                            <Lock size={16} /> 256-bit SSL Secure Payment
                        </div>
                    </div>

                    <div style={{ position: 'sticky', top: '120px' }}>
                        <div className="card" style={{ padding: '40px', borderRadius: '32px' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '32px', letterSpacing: '-0.02em' }}>Order Summary</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hostel</div>
                                        <div style={{ fontSize: '17px', fontWeight: '750' }}>{bookingDetails.hostelName}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Room Context</div>
                                        <div style={{ fontSize: '17px', fontWeight: '750' }}>{bookingDetails.roomType} Room</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reservation For</div>
                                        <div style={{ fontSize: '17px', fontWeight: '750' }}>{bookingDetails.studentName}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'var(--border-light)', marginBottom: '32px' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: '800' }}>Total Amount</div>
                                <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)' }}>₹{bookingDetails.totalAmount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .payment-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default Payment;
