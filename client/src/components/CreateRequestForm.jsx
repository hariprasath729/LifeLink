import React, { useState } from 'react';
import axios from 'axios';

const CreateRequestForm = ({ onNewRequest }) => {
  const [requestType, setRequestType] = useState('blood');
  
  // Define the initial state for the form
  const initialState = {
    units: '',
    bloodType: '', // Changed from 'A+' to empty
    medicineName: '',
    dosage: '',
    urgency: '', // Changed from 'High' to empty
  };
  
  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState('');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // Simple validation for dropdowns
    if ((requestType === 'blood' && !formData.bloodType) || !formData.urgency) {
      setMessage('Please select a blood type and urgency.');
      return;
    }
    
    const token = localStorage.getItem('token');
    const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
    const details = requestType === 'blood' 
      ? { bloodType: formData.bloodType, units: formData.units } 
      : { medicineName: formData.medicineName, dosage: formData.dosage, units: formData.units };
    
    const body = JSON.stringify({ requestType, details, urgency: formData.urgency });

    try {
      const res = await axios.post('http://localhost:5001/api/requests', body, config);
      setMessage('Request created successfully!');
      onNewRequest(res.data);
      
      // Reset the form to its initial empty state
      setFormData(initialState);

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("API call failed:", err);
      setMessage('Failed to create request.');
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold mb-4 text-text-primary">Create a New Request</h3>
      <div className="flex border border-border/50 rounded-lg p-1 mb-4">
        <button onClick={() => setRequestType('blood')} className={`w-1/2 py-2 rounded-md transition-colors ${requestType === 'blood' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface'}`}>
          Blood
        </button>
        <button onClick={() => setRequestType('medicine')} className={`w-1/2 py-2 rounded-md transition-colors ${requestType === 'medicine' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface'}`}>
          Medicine
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {requestType === 'blood' ? (
          <div>
            <label className="block text-sm font-medium text-text-secondary">Blood Type</label>
            <select name="bloodType" value={formData.bloodType} onChange={onChange} required className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary">
              {/* ADDED a disabled placeholder option */}
              <option value="" disabled>-- Select Blood Type --</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
            </select>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-text-secondary">Medicine Name</label>
              <input type="text" placeholder="e.g., Paracetamol" name="medicineName" value={formData.medicineName} onChange={onChange} required className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary placeholder-text-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary">Dosage (e.g., 500mg)</label>
              <input type="text" placeholder="e.g., 500mg" name="dosage" value={formData.dosage} onChange={onChange} required className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary placeholder-text-secondary" />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-text-secondary">Units / Quantity</label>
          <input type="number" placeholder="e.g., 10" name="units" value={formData.units} onChange={onChange} required className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary placeholder-text-secondary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">Urgency</label>
          <select name="urgency" value={formData.urgency} onChange={onChange} required className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary">
            {/* ADDED a disabled placeholder option */}
            <option value="" disabled>-- Select Urgency --</option>
            <option>Routine</option><option>High</option><option>Critical</option>
          </select>
        </div>
        <button type="submit" className="w-full btn-primary">
          Submit Request
        </button>
        {message && <p className={`text-sm mt-2 text-center ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
      </form>
    </>
  );
};

export default CreateRequestForm;