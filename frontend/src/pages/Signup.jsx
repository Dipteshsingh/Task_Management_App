import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Signup = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName:'', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:4000/api/user/signup`, formData, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      if (res.data.success) {

        login(res.data.token, res.data.user.role);
        navigate('/');
      } else {
        setError(res.data.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 w-96 rounded shadow">
        <h2 className="text-2xl mb-4">Signup</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full border p-2 rounded mb-3"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full border p-2 rounded mb-3"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-3"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className={`w-full text-white py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p>Already have an account?</p> <Link className='text-blue-500' to={'/login'}>Login</Link>
      </form>
    </div>
  );
};

export default Signup;
