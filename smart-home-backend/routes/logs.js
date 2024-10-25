// routes/logs.js
const express = require('express');
const router = express.Router();
const { logAccess, getLogs } = require('../blockchain/contract');

// Route to log access attempt
router.post('/logAccess', async (req, res) => {
  const { deviceID, action } = req.body;
  try {
    const txHash = await logAccess(deviceID, action);
    res.status(200).json({ message: 'Access logged', txHash });
  } catch (error) {
    res.status(500).json({ error: 'Error logging access attempt' });
  }
});

// Route to get all access logs
router.get('/getLogs', async (req, res) => {
  try {
    const logs = await getLogs();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving logs' });
  }
});

module.exports = router;
