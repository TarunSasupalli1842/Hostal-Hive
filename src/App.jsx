
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home as HomeIcon, BookOpen, User, Building, LayoutDashboard, Menu, X, Sparkles, Navigation } from 'lucide-react';
import { initStorage, getCurrentUser, logout } from './utils/storage';
import { initFirebase } from './utils/firebaseService';

// Pages
import Home from './pages/Home';
import HostelDetail from './pages/HostelDetail';
import RoomDetail from './pages/RoomDetail';
import Payment from './pages/Payment';
import Success from './pages/Success';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setIsOpen(false);
  };

  const isHome = location.pathname === '/';
  const navBackground = scrolled ? 'rgba(255, 255, 255, 0.8)' : (isHome ? 'transparent' : 'white');
  const textColor = scrolled || !isHome ? 'var(--text-main)' : 'white';
  const logoColor = scrolled || !isHome ? 'var(--primary)' : 'white';

  return (
    <nav className={scrolled ? 'glass' : ''} style={{
      backgroundColor: navBackground,
      borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      height: scrolled ? '80px' : '90px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Link to="/" style={{ textDecoration: 'none', color: logoColor, display: 'flex', alignItems: 'center', gap: '12px', transition: 'color 0.4s' }}>
          <div style={{ background: scrolled || !isHome ? 'var(--primary)' : 'white', color: scrolled || !isHome ? 'white' : 'var(--primary)', padding: '8px', borderRadius: '12px', display: 'flex', transition: 'all 0.4s' }}>
            <Building size={24} strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px' }}>HostelHive</span>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-only" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: textColor, fontWeight: 700, fontSize: '16px', letterSpacing: '0.2px' }}>Explore</Link>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" style={{ textDecoration: 'none', color: textColor, fontWeight: 700, fontSize: '16px' }}>Dashboard</Link>
              ) : (
                <Link to="/my-bookings" style={{ textDecoration: 'none', color: textColor, fontWeight: 700, fontSize: '16px' }}>My Bookings</Link>
              )}
              <div style={{ height: '24px', width: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: textColor }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  {user.name.charAt(0)}
                </div>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>{user.name}</span>
              </div>
              <button onClick={handleLogout} style={{ background: 'var(--secondary)', color: 'white', padding: '10px 20px', borderRadius: '14px', fontSize: '15px' }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none', color: textColor, fontWeight: 700, fontSize: '16px' }}>Sign In</Link>
              <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', borderRadius: '16px', padding: '12px 28px', fontSize: '16px' }}>Join Now</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-only" onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', color: textColor }}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-only animate-fade" style={{ position: 'absolute', top: '100%', left: '16px', right: '16px', background: 'white', padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link to="/" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '18px', fontWeight: '700' }}>Home</Link>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '18px', fontWeight: '700' }}>Dashboard</Link>
              ) : (
                <Link to="/my-bookings" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '18px', fontWeight: '700' }}>My Bookings</Link>
              )}
              <button onClick={handleLogout} className="btn-primary" style={{ width: '100%', borderRadius: '16px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '18px', fontWeight: '700' }}>Login</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary" style={{ textDecoration: 'none', borderRadius: '16px', textAlign: 'center' }}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    initStorage();
    return getCurrentUser();
  });

  useEffect(() => {
    initFirebase();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <Router>
      <div className="app" style={{ paddingTop: '0' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <main style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hostel/:id" element={<HostelDetail user={user} />} />
            <Route path="/room/:id" element={<RoomDetail user={user} />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student-login" element={<StudentLogin onLogin={handleLogin} />} />
            <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer style={{ background: '#0f172a', color: 'white', padding: '80px 0 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}></div>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '64px', marginBottom: '64px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ background: 'white', color: 'var(--primary)', padding: '6px', borderRadius: '10px' }}>
                    <Building size={20} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '20px' }}>HostelHive</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                  Redefining student accommodation with technology and transparency. Find your place, feel at home.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '18px', marginBottom: '24px' }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '15px' }}>Browse Hostels</Link>
                  <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '15px' }}>Student Login</Link>
                  <Link to="/admin-login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '15px' }}>Property Owners</Link>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '18px', marginBottom: '24px' }}>Contact</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>support@hostelhive.com</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>+91 9988776655</div>
                </div>
              </div>
            </div>
            <div style={{ paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>&copy; 2026 HostelHive. Built for students, by students.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
