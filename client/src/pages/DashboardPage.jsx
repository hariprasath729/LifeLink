import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import CreateRequestForm from '../components/CreateRequestForm.jsx';
import ChatBox from '../components/ChatBox.jsx';
import ProfileDropdown from '../components/ProfileDropdown.jsx';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [communityRequests, setCommunityRequests] = useState([]);
  const [donorAvailableRequests, setDonorAvailableRequests] = useState([]);
  const [activeChatRequestId, setActiveChatRequestId] = useState(null);
  const [hospitalView, setHospitalView] = useState('myRequests');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const decoded = jwtDecode(token);
    setUser(decoded.user);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (decoded.user.role === 'hospital') {
      axios.get('http://localhost:5001/api/requests/my-requests', config).then(res => setMyRequests(res.data));
      axios.get('http://localhost:5001/api/requests/community', config).then(res => setCommunityRequests(res.data));
    } else {
      axios.get('http://localhost:5001/api/requests', config).then(res => setDonorAvailableRequests(res.data));
    }
  }, [navigate]);

  const handleAcceptRequest = async (requestId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5001/api/requests/${requestId}/accept`, null, config);
      if (user.role === 'donor') {
        setDonorAvailableRequests(prev => prev.filter(req => req._id !== requestId));
      } else {
        setCommunityRequests(prev => prev.filter(req => req._id !== requestId));
      }
      setActiveChatRequestId(requestId);
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5001/api/requests/${requestId}/complete`, null, config);
      setMyRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (error) {
      console.error("Failed to complete request", error);
    }
  };

  if (!user) { return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>; }

  const pendingRequests = myRequests.filter(r => r.status === 'Pending');
  const acceptedRequests = myRequests.filter(r => r.status === 'Accepted');

  const Card = ({ children, className }) => ( <div className={`bg-surface/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg p-6 ${className}`}>{children}</div>);
  
  const RequestCard = ({ req, onAccept, buttonText, buttonClass }) => (
    <Card className="flex flex-col justify-between hover:border-primary transition-all duration-300">
      <div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${req.urgency === 'Critical' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{req.urgency}</span>
        <h4 className="text-lg font-bold mt-4 text-text-primary">{req.requestType === 'blood' ? `Blood Needed: ${req.details.bloodType}` : `Medicine: ${req.details.medicineName}`}</h4>
        <p className="text-text-secondary text-sm">From: {req.requestedBy.profile.name}</p>
        <p className="text-text-secondary text-sm">Units: {req.details.units}</p>
      </div>
      <button onClick={() => onAccept(req._id)} className={`w-full mt-6 ${buttonClass}`}>{buttonText}</button>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="bg-surface/50 backdrop-blur-xl border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">LifeLink</h1>
          <ProfileDropdown user={user} />
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <h2 className="text-4xl font-light text-text-primary mb-8">Welcome, <span className="font-bold">{user.name}</span></h2>
        
        {user.role === 'hospital' && (
          <div>
            <div className="mb-8 border-b border-border/50">
              <nav className="-mb-px flex space-x-8">
                <button onClick={() => setHospitalView('myRequests')} className={`py-4 px-1 border-b-2 font-bold text-base ${hospitalView === 'myRequests' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>Manage My Requests</button>
                <button onClick={() => setHospitalView('community')} className={`py-4 px-1 border-b-2 font-bold text-base ${hospitalView === 'community' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>Fulfill Community Requests</button>
              </nav>
            </div>

            {hospitalView === 'myRequests' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1"><Card><CreateRequestForm onNewRequest={(newReq) => setMyRequests([newReq, ...myRequests])} /></Card></div>
                <div className="lg:col-span-2 space-y-8">
                  <Card><h3 className="text-xl font-bold mb-4 text-text-primary">Accepted Requests</h3>{acceptedRequests.length > 0 ? acceptedRequests.map(req => (<div key={req._id} className="border-b border-border/50 last:border-b-0 py-4"><p className="font-semibold text-lg text-text-primary">{req.requestType === 'blood' ? `Blood: ${req.details.bloodType}` : `Medicine: ${req.details.medicineName}`}</p><p className="text-text-secondary">Accepted by: <span className="font-medium text-text-primary">{req.acceptedBy?.profile.name || 'N/A'}</span></p><p className="text-text-secondary">Contact: <span className="font-medium text-text-primary">{req.acceptedBy?.profile.mobile || 'N/A'}</span></p><div className="mt-2 flex space-x-2"><button onClick={() => setActiveChatRequestId(req._id)} className="text-sm btn-primary">Chat</button><button onClick={() => handleCompleteRequest(req._id)} className="text-sm btn-success">Mark as Completed</button></div></div>)) : <p className="text-text-secondary">No requests accepted yet.</p>}</Card>
                  <Card><h3 className="text-xl font-bold mb-4 text-text-primary">Pending Requests</h3>{pendingRequests.length > 0 ? pendingRequests.map(req => (<div key={req._id} className="border-b border-border/50 last:border-b-0 py-3"><p className="font-semibold text-text-primary">{req.requestType === 'blood' ? `Blood: ${req.details.bloodType}` : `Medicine: ${req.details.medicineName}`}</p><p className="text-text-secondary">Units: {req.details.units} | Urgency: {req.urgency}</p></div>)) : <p className="text-text-secondary">You have no pending requests.</p>}</Card>
                </div>
              </div>
            )}
            
            {hospitalView === 'community' && (
               <div><h3 className="text-2xl font-bold mb-6 text-text-primary">Requests From Other Hospitals</h3>{communityRequests.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{communityRequests.map(req => (<RequestCard key={req._id} req={req} onAccept={handleAcceptRequest} buttonText="Fulfill This Request" buttonClass="btn-success"/>))}</div>) : (<Card><p className="text-text-secondary text-center">No requests from other hospitals right now.</p></Card>)}</div>
            )}
          </div>
        )}

        {user.role === 'donor' && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-text-primary">Available Blood Requests</h3>
            {donorAvailableRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donorAvailableRequests.map(req => (
                  <RequestCard key={req._id} req={req} onAccept={handleAcceptRequest} buttonText="Accept Request" buttonClass="btn-primary"/>
                ))}
              </div>
            ) : (
              <Card><p className="text-text-secondary text-center">No pending blood requests. Thank you!</p></Card>
            )}
          </div>
        )}
      </main>

      {activeChatRequestId && (
        <ChatBox 
          requestId={activeChatRequestId} 
          user={user} 
          onClose={() => setActiveChatRequestId(null)} 
        />
      )}
    </div>
  );
};

export default DashboardPage;