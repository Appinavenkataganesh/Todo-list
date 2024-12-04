import React, { useState } from 'react';
import '../component/Register.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    form: '',
  });

  const navigate = useNavigate();

  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/register';

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      form: '',
    };

    if (!firstName) newErrors.firstName = 'First Name is required';
    else if (firstName.length > 20) newErrors.firstName = 'First Name must be at most 20 characters';

    if (!lastName) newErrors.lastName = 'Last Name is required';
    else if (lastName.length > 20) newErrors.lastName = 'Last Name must be at most 20 characters';

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (password.length > 16) newErrors.password = 'Password must be at most 16 characters';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear individual field error
  };

  const onSubmit = async e => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.values(validationErrors).some(error => error)) {
      setErrors({ ...validationErrors, form: 'Please fix the errors above' });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/register', formData);
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrors({ ...errors, form: err.response?.data?.msg || 'An unexpected error occurred' });
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      await axios.post('http://localhost:5000/api/auth/google', {
        id_token: response.credential,
      });
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrors({ ...errors, form: 'Google login failed' });
    }
  };

  const handleGoogleFailure = (response) => {
    console.error(response.error);
    setErrors({ ...errors, form: 'Google login failed' });
  };

  return (
    <div className='container_red'>
      <nav className="navbar1">
        <div className="nav-buttons">
          <Link to="/" className={isLoginPage ? 'active' : ''}>
            Login
          </Link>
          <Link to="/register" className={isRegisterPage ? 'active' : ''}>
            Signup
          </Link>
        </div>
      </nav>
      <div className="main-reg">
        <p className='head_sign'>Signup</p>
        <div className="register-container">
          <div className="register-form">
            {errors.form && <p className="error-message">{errors.form}</p>}
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={firstName} 
                  onChange={onChange} 
                  required 
                  maxLength="20" 
                  placeholder='First Name'
                />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={lastName} 
                  onChange={onChange} 
                  required 
                  maxLength="20" 
                  placeholder='Last Name'
                />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={email} 
                  onChange={onChange} 
                  required 
                  placeholder='Email'
                  maxLength="50" 
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={password} 
                  onChange={onChange} 
                  required 
                  minLength="8" 
                  maxLength="16" 
                  placeholder='Password'
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={confirmPassword} 
                  onChange={onChange} 
                  required 
                  minLength="8" 
                  maxLength="16" 
                  placeholder='Confirm Password'
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>
              <button type="submit" className='butt_reg'>Sign Up</button>
            </form>
            <div className="already-have-account">
              <p>Already have an account? <Link to="/">Login</Link></p>
            </div>
            <div className="google-login">
              <GoogleOAuthProvider clientId="360980389026-licn458319rhsi23eopgedav86qt9j32.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onFailure={handleGoogleFailure}
                  className="google-login-button"
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
