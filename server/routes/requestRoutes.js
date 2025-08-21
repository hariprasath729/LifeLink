const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getRequests, createRequest, acceptRequest, getMyRequests, getCommunityRequests, completeRequest } = require('../controllers/requestController'); // Added completeRequest

// ... (other routes are the same)
router.get('/my-requests', authMiddleware, getMyRequests);
router.get('/community', authMiddleware, getCommunityRequests);
router.get('/', authMiddleware, getRequests);
router.post('/', authMiddleware, createRequest);
router.put('/:id/accept', authMiddleware, acceptRequest);


// @route   PUT api/requests/:id/complete
// @desc    Mark a request as completed
// @access  Private (Hospitals)
router.put('/:id/complete', authMiddleware, completeRequest); // <-- ADD THIS LINE

module.exports = router;