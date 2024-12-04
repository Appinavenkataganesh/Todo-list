import React, { useState } from 'react';
import '../component/Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: '',
  });

  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/register';

  const navigate = useNavigate();

  const { email, password } = formData;

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      form: '',
    };

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (password.length > 16) newErrors.password = 'Password must be at most 16 characters';

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

    setErrors({ ...errors, form: '' }); // Clear form error before login attempt

    try {
      await axios.post('http://localhost:5000/api/login', { email, password });
      navigate('/dashboard'); // Redirect to dashboard or home upon successful login
    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrors({ ...errors, form: err.response?.data?.msg || 'An unexpected error occurred' });
    }
  };

  const handleGoogleSuccess = async (response) => {
    setErrors({ ...errors, form: '' }); // Clear form error before Google login attempt

    try {
      await axios.post('http://localhost:5000/api/auth/google', {
        id_token: response.tokenId,
      });
      navigate('/dashboard'); // Redirect to dashboard or home upon successful login
    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrors({ ...errors, form: 'Google login failed' });
    }
  };

  const handleGoogleFailure = (error) => {
    console.error(error);
    setErrors({ ...errors, form: 'Google login failed' });
  };

  return (
    <div className="main-log">
      <nav className="navbar1">
      <div className="nav-buttons">
        <Link to="/" className={isLoginPage ? 'active' : ''}>
          {isLoginPage ? 'Login' : 'Login'}
        </Link>
        <Link to="/register" className={isRegisterPage ? 'active' : ''}>
          {isRegisterPage ? 'Signup' : 'Signup'}
        </Link>
      </div>
    </nav>
      <p className='log_head'>Login</p>
      <div className="login-container">
        <div className="login-form">
          <form onSubmit={onSubmit}>
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
            <button type="submit" className='butt_log'>Login</button>
          </form>
          <div>
            <p className='para_gh'>Don't have an account? <Link to="/register">Sign up!</Link></p>
          </div>
          <div className="google-login">
            <GoogleLogin
              clientId="360980389026-licn458319rhsi23eopgedav86qt9j32.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
