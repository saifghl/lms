import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Admin'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // MOCK LOGIN LOGIC with Explicit Role Selection
    const selectedRole = formData.role;
    let redirectPath = '/admin/dashboard';
    let userRole = 'admin';

    // Role-based logic
    switch (selectedRole) {
      case 'Admin':
        redirectPath = '/admin/dashboard';
        userRole = 'admin';
        break;
      case 'Lease manager':
        redirectPath = '/lease/dashboard';
        userRole = 'lease_manager';
        break;
      case 'Management Rep':
        redirectPath = '/management/dashboard';
        userRole = 'management_rep';
        break;
      default:
        redirectPath = '/admin/dashboard';
    }

    // Set Mock Token and User in LocalStorage
    localStorage.setItem('token', 'mock-jwt-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify({
      id: 999,
      name: 'Mock User',
      email: formData.email,
      role: userRole
    }));

    console.log(`Mock Login Successful: Role=${selectedRole}, Redirect=${redirectPath}`);
    navigate(redirectPath);
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-left">
          <div className="brand-logo">
            {/* Logo Placeholder */}
            <div className="logo-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span>Cusec Consulting LLP</span>
          </div>

          <div className="hero-image-container">
            <div className="hero-image-placeholder"></div>
          </div>

          <div className="hero-text">
            <h2>Manage Properties with ease</h2>
            <p>Streamline your workflow and keep track of all your lease agreements in one place.</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please enter your details to log in.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email/Mobile No.</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  type="text"
                  name="email"
                  placeholder="Enter Your Email or Mobile No."
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Select Role</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 60px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    color: '#2d3748',
                    appearance: 'none',
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Admin">Admin</option>
                  <option value="Lease Manager">Lease Manager</option>
                  <option value="Management Rep">Management Rep</option>
                </select>
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#718096'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <button className="forgot-password" style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: 'inherit', cursor: 'pointer' }}>Forgot Password?</button>
            </div>

            <button type="submit" className="login-button">
              Login
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>

          <div className="signup-link">
            Don't have an account? <button style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: 'inherit', cursor: 'pointer' }}>sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
