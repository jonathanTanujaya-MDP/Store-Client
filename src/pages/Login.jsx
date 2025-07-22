import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Lock, LogIn, Loader, Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        {/* Decorative Elements */}
        <div className="geometric-bg">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
        
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-modern">
              <LogIn size={28} />
            </div>
            <h1 className="login-title-modern">Login to Manajemen Stok</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form-modern">
            {error && (
              <div className="error-message-modern">
                {error}
              </div>
            )}

            <div className="form-group-modern">
              <div className="input-wrapper-modern">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input-modern"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
                <User className="input-icon-modern" size={20} />
              </div>
            </div>

            <div className="form-group-modern">
              <div className="input-wrapper-modern">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input-modern"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <Lock className="input-icon-modern" size={20} />
                <button
                  type="button"
                  className="password-toggle-modern"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button-modern"
              disabled={isLoading || !formData.username || !formData.password}
            >
              {isLoading ? (
                <>
                  <Loader className="spinner-modern" size={20} />
                  Signing in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="login-footer-modern">
            <p className="copyright-text">© 2025 Manajemen Stok System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
