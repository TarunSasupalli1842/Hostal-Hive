import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/storage';
import { addBooking, updateDocument } from '../utils/firebaseService';
import { CreditCard, ShieldCheck, ArrowRight, Loader } from 'lucide-react';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingDetails = location.state?.bookingData;
    const [isProcessing, setIsProcessing] = useState(false);
    const [amount, setAmount] = useState('');
    const user = getCurrentUser();
    const [error, setError] = useState('');

    if (!bookingDetails) { // Changed from booking to bookingDetails
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

            const finalBooking = {
                ...bookingDetails, // Contains studentName, phone, college from the form
                studentId: bookingDetails.studentId || user.id || user.email,
                status: 'Confirmed',
                createdAt: new Date().toISOString()
            };

            // Ensure we don't accidentally wipe current form data with empty user details
            finalBooking.studentName = bookingDetails.studentName || user.name || 'Student';
            finalBooking.phone = bookingDetails.phone || user.phone || 'N/A';

            await addBooking(finalBooking);

            setTimeout(() => {
                navigate('/success');
            }, 800);

        } catch (err) {
            console.error("Payment registration error:", err);
            setIsProcessing(false);
            setError(`Error: ${err.message || "Payment registration failed. Please check your connection."}`);
        }
    };

    return (
        <div className="theme-rose" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <div className="container" style={{ padding: '130px 24px 80px', display: 'flex', justifyContent: 'center' }}>
                <div className="card animate-fade" style={{ width: '100%', maxWidth: '550px', padding: '48px', background: 'white', borderRadius: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ background: '#dcfce7', color: '#166534', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <ShieldCheck size={40} />
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Secure Checkout</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Complete payment to confirm booking</p>
                    </div>

                    <div style={{ background: 'var(--bg-subtle)', padding: '32px', borderRadius: '24px', marginBottom: '32px', border: '1px dashed var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '600' }}>Payable Amount</span>
                            <span style={{ fontWeight: 800, fontSize: '32px', color: 'var(--primary)' }}>₹{bookingDetails.totalAmount}</span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center' }}>* Dummy payment: Enter exactly the amount above to confirm.</p>
                    </div>

                    {error && <p style={{ color: 'var(--secondary)', textAlign: 'center', marginBottom: '20px', fontWeight: '700', fontSize: '16px' }}>{error}</p>}

                    <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div>
                            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', display: 'block', textTransform: 'uppercase' }}>Enter Amount (₹)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{ fontSize: '36px', fontWeight: '800', textAlign: 'center', height: '84px', borderRadius: '20px' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-subtle)', padding: '20px', borderRadius: '16px', fontSize: '15px', color: 'var(--text-muted)' }}>
                            <CreditCard size={20} color="var(--primary)" />
                            <span>This is a simulated secure environment. No actual money will be charged.</span>
                        </div>

                        <button type="submit" className="btn-primary" disabled={isProcessing} style={{ height: '74px', fontSize: '20px', borderRadius: '24px' }}>
                            {isProcessing ? (
                                <>
                                    <Loader className="animate-spin" size={24} /> Processing Securely...
                                </>
                            ) : (
                                <>
                                    Confirm & Pay Now <ArrowRight size={24} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;
