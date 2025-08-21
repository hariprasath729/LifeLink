import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [role, setRole] = useState('donor');
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    address: '',
    mobile: '',
    donorSecretKey: '', // For hospital to set, and donor to enter
    bloodType: 'A+',
    registeredByHospital: '', // This will be the hospital's ID
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch hospital list when component mounts
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/auth/hospitals');
        setHospitals(res.data);
      } catch (err) {
        console.error('Failed to fetch hospitals');
      }
    };
    fetchHospitals();
  }, []);

  const { username, password, name, address, mobile, donorSecretKey, bloodType, registeredByHospital } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const profileData = { name, address, mobile };
    let submissionData = { username, password, role };

    if (role === 'hospital') {
      profileData.donorSecretKey = donorSecretKey;
    } else {
      profileData.bloodType = bloodType;
      profileData.registeredByHospital = registeredByHospital;
      submissionData.donorSecretKey = donorSecretKey;
    }
    submissionData.profile = profileData;

    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', submissionData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
          <p className="mt-2 text-gray-600">Join our life-saving network</p>
        </div>

        <div className="flex justify-center border border-gray-200 rounded-lg p-1">
          <button onClick={() => setRole('donor')} className={`w-1/2 py-2 rounded-md ${role === 'donor' ? 'bg-primary text-white' : 'text-gray-600'}`}>
            I'm a Donor
          </button>
          <button onClick={() => setRole('hospital')} className={`w-1/2 py-2 rounded-md ${role === 'hospital' ? 'bg-primary text-white' : 'text-gray-600'}`}>
            I'm a Hospital
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" placeholder={role === 'hospital' ? 'Hospital Name' : 'Full Name'} name="name" value={name} onChange={onChange} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" placeholder="Address" name="address" value={address} onChange={onChange} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" placeholder="Mobile Number" name="mobile" value={mobile} onChange={onChange} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />

          {role === 'hospital' && (
            <input type="password" placeholder="Create a Secret Key for Donors" name="donorSecretKey" value={donorSecretKey} onChange={onChange} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          )}

          {role === 'donor' && (
            <>
              <select name="bloodType" value={bloodType} onChange={onChange} className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
              </select>
              <select name="registeredByHospital" value={registeredByHospital} onChange={onChange} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">-- Select Registering Hospital --</option>
                {hospitals.map(h => <option key={h._id} value={h._id}>{h.profile.name}</option>)}
              </select>
              <input type="password" placeholder="Hospital's Secret Key" name="donorSecretKey" value={donorSecretKey} onChange={onChange} required className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;