import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from '../redux/authSlice';
import FuelHero from '../components/fuel/FuelHero';
import '../styles/FuelLogin.css';

function Icon({ name, size = 20 }) {
  const paths = {
    leaf: 'M20 4C8 2 2 8 5 16c6 7 16 0 15-12ZM5 19 15 9',
    plan: 'M6 4h12v17H6zM9 2h6v4H9zM9 11h6M9 15h4',
    progress: 'M4 20V12M10 20V8M16 20V4M3 20h18',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    lock: 'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);
  const handleLogin = async (event) => {
    event.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      localStorage.setItem('token', result.payload.token);
      localStorage.setItem('email', result.payload.email);
      toast.success('Login successful! Welcome back!');
      navigate('/dashboard');
    }
  };
  return <div className="fuel-login">
    <header className="fuel-nav">
      <Link className="fuel-brand" to="/" aria-label="GymFuel home"><span className="fuel-brand__mark" aria-hidden="true">ϟ</span>GymFuel<span style={{ color: 'var(--fuel-blue)' }}>.</span></Link>
      <nav className="fuel-nav__right" aria-label="Account"><span>A little consistency. A lot of progress.</span><Link className="fuel-nav__link" to="/signup">Join GymFuel <span aria-hidden="true">↗</span></Link></nav>
    </header>
    <main className="fuel-main">
      <section className="fuel-editorial" aria-labelledby="fuel-heading">
        <div className="fuel-eyebrow">NUTRITION MEETS INTENTION</div>
        <h1 id="fuel-heading">Fuel your body.<br /><em>Build your better.</em></h1>
        <p className="fuel-intro">Good nutrition is a daily practice. Bring your meals, your plans, and your progress together.</p>
        <FuelHero />
        <div className="fuel-pillars">
          <div className="fuel-pillar"><Icon name="leaf" /><span>Smarter nutrition</span></div>
          <div className="fuel-pillar"><Icon name="plan" /><span>Personalized plans</span></div>
          <div className="fuel-pillar"><Icon name="progress" /><span>Everyday progress</span></div>
        </div>
      </section>
      <section aria-labelledby="signin-heading">
        <div className="fuel-form-card">
          <p className="fuel-form-kicker">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2 id="signin-heading">Welcome back.</h2>
          <p className="fuel-form-subtitle">Ready to keep the momentum going?<br />Sign in to your GymFuel account.</p>
          <form onSubmit={handleLogin}>
            {error && <p role="alert" className="fuel-error">{typeof error === 'string' ? error : 'Unable to sign in. Please try again.'}</p>}
            <div className="fuel-field"><label htmlFor="fuel-email">Email address</label><input id="fuel-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></div>
            <div className="fuel-field"><label htmlFor="fuel-password">Password</label><div className="fuel-password"><input id="fuel-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}><Icon name="eye" size={18} /></button></div></div>
            <button className="fuel-submit" type="submit" disabled={loading}><span>{loading ? 'Signing in…' : 'Sign in'}</span><span aria-hidden="true">→</span></button>
          </form>
          <p className="fuel-form-signup">New to GymFuel? <Link to="/signup">Create an account</Link></p>
        </div>
        <p className="fuel-form-note"><Icon name="lock" size={13} /> Your goals. Your space. Your pace.</p>
      </section>
    </main>
    <footer className="fuel-footer"><span>© {new Date().getFullYear()} GymFuel</span><span>Made for the work you put in. Every day.</span></footer>
  </div>;
}
