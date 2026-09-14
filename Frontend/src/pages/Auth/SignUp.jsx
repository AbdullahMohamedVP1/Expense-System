// By Mohamed Shehab
// src/pages/Auth/SignUp.jsx

import React, { useState } from 'react';
import AuthLayouts from '../../components/layouts/AuthLayouts';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/input';
import ProfilePhotoSelector from '../../components/inputs/profilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import { registerUser, uploadProfileImage } from '../../api/authApi';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError('Please enter your full name.');
      return;
    }

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
      let profileImageUrl = '';
      if (profilePic) {
        try {
          const uploadResult = await uploadProfileImage(profilePic);
          profileImageUrl = uploadResult.imageUrl || '';
        } catch (uploadError) {
          // Non-fatal: continue signing up without a photo rather than blocking the user.
          console.error(uploadError);
        }
      }

      const data = await registerUser({ fullName, email, password, profileImageUrl });
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <AuthLayouts>
      <h3 className="h5 fw-semibold text-dark mb-1">Create an Account</h3>
      <p className="text-secondary small mb-3">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className="row g-2">
          <div className="col-md-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <Input
          label="Password"
          type="password"
          placeholder="Min 8 Characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-danger small mb-2 text-start">{error}</p>}

        <button type="submit" className="btn btn-primary w-100 mt-2 py-2 fw-medium">
          SIGN UP
        </button>

        <p className="text-center small text-secondary mt-3 mb-0">
          Already have an account?{' '}
          <Link to="/login" className="text-primary text-decoration-underline fw-medium">
            Login
          </Link>
        </p>
      </form>
    </AuthLayouts>
  );
};

export default SignUp;