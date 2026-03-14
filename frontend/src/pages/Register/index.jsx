import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ThreeBackground from '../../components/ThreeBackground';
import GlassCard from '../../components/GlassCard';
import { clearAuthMessages, registerUser } from '../../features/auth/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthMessages());
    try {
      await dispatch(registerUser(form)).unwrap();
      navigate('/login');
    } catch {
      return null;
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center p-4">
      <ThreeBackground />
      <GlassCard className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input name="name" placeholder="Full name" className="glass-input" value={form.name} onChange={onChange} required />
          <input name="email" type="email" placeholder="Email" className="glass-input" value={form.email} onChange={onChange} required />
          <input name="password" type="password" placeholder="Password" className="glass-input" value={form.password} onChange={onChange} required />
          <button type="submit" className="primary-btn w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        {error && <p className="text-sm text-rose-200">{error}</p>}
        <p className="text-sm text-slate-200">
          Already have an account? <Link to="/login" className="text-cyan-200">Login</Link>
        </p>
      </GlassCard>
    </div>
  );
}
