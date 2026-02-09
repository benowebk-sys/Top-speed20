import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/api';
import '../styles/auth.css';

export const SignUpPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) return setError('جميع الحقول مطلوبة');
    if (formData.password.length < 6) return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    if (formData.password !== formData.confirmPassword) return setError('كلمات المرور غير متطابقة');

    setLoading(true);
    try {
      const { data } = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(data.message || 'تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'فشل إنشاء الحساب');
    } finally { setLoading(false); }
  };

  return (
    <section className="auth-section">
      {Array.from({ length: 200 }).map((_, i) => (
        <span key={i} />
      ))}

      <div className="signin">
        <div className="content">
          <h2>Sign Up</h2>
          <div className="form">
            <form onSubmit={handleSignUp}>
              <div className="inputBx">
                <input name="name" type="text" value={formData.name} onChange={handleChange} required />
                <i>Full Name</i>
              </div>
              <div className="inputBx">
                <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                <i>Email</i>
              </div>
              <div className="inputBx">
                <input name="password" type="password" value={formData.password} onChange={handleChange} required />
                <i>Password</i>
              </div>
              <div className="inputBx">
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                <i>Confirm Password</i>
              </div>

              {error && <div className="error-box">{error}</div>}
              {success && <div className="success-box">{success}</div>}

              <div className="inputBx">
                <input type="submit" value={loading ? 'Creating Account...' : 'Create Account'} />
              </div>
            </form>

            <div className="links">
              <Link to="/login">Login</Link>
              <Link to="/">Home</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
