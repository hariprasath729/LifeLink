const Request = require('../models/Request');

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requestedBy: req.user.id })
      .populate('acceptedBy', 'profile.name profile.mobile')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: 'Pending', requestType: 'blood' })
      .populate('requestedBy', 'profile.name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCommunityRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: 'Pending', requestedBy: { $ne: req.user.id } })
      .populate('requestedBy', 'profile.name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createRequest = async (req, res) => {
  if (req.user.role !== 'hospital') {
    return res.status(403).json({ msg: 'Forbidden: Only hospitals can create requests.' });
  }
  try {
    const newRequest = new Request({ ...req.body, requestedBy: req.user.id });
    const request = await newRequest.save();
    res.status(201).json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) { return res.status(404).json({ msg: 'Request not found' }); }
    if (request.status !== 'Pending') { return res.status(400).json({ msg: 'This request is no longer available.' }); }
    if (req.user.role === 'hospital' && request.requestedBy.toString() === req.user.id.toString()) {
      return res.status(403).json({ msg: 'Cannot accept your own request.' });
    }
    request.status = 'Accepted';
    request.acceptedBy = req.user.id;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.completeRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }
    if (request.requestedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    request.status = 'Completed';
    await request.save();
    res.json({ msg: 'Request marked as completed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};