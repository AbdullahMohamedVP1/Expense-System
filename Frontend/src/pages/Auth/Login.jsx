// By Mohamed Shehab
import React, { useState } from 'react';
import AuthLayouts from '../../components/layouts/AuthLayouts';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/input';
import { validateEmail } from '../../utils/helper';
import { loginUser } from '../../api/authApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

 const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter the password.');
      return;
    }

    setError('');

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <AuthLayouts>
      <h3 className="h5 fw-semibold text-dark mb-1">Welcome Back</h3>
      <p className="text-secondary small mb-4">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min 8 Characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-danger small mb-2 text-start">{error}</p>}

        <button type="submit" className="btn btn-primary w-100 mt-2 py-2 fw-medium">
          LOGIN
        </button>

        <p className="text-center small text-secondary mt-3 mb-0">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary text-decoration-underline fw-medium">
            SignUp
          </Link>
        </p>
      </form>
    </AuthLayouts>
  );
};

export default Login;