const express = require('express');
const router = express.Router();
const { logAccess, getLogs, setUsername } = require('../blockchain/contract');

// Route to log an access attempt
router.post('/logAccess', async (req, res) => {
  const { deviceID, action } = req.body;

  // Validate input
  if (!deviceID || !action) {
    return res.status(400).json({ error: 'Missing required fields: deviceID and action' });
  }

  try {
    const txHash = await logAccess(deviceID, action);
    res.status(200).json({ message: 'Access logged successfully', txHash });
  } catch (error) {
    console.error('Error logging access attempt:', error);
    res.status(500).json({ error: 'Error logging access attempt' });
  }
});

// Route to retrieve all access logs
router.get('/getLogs', async (req, res) => {
  try {
    const logs = await getLogs();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({ error: 'Error retrieving logs' });
  }
});

// Route to set username for an account
router.post('/setUsername', async (req, res) => {
  const { username } = req.body;

  // Validate input
  if (!username) {
    return res.status(400).json({ error: 'Missing required field: username' });
  }

  try {
    const txHash = await setUsername(username);
    res.status(200).json({ message: 'Username set successfully', txHash });
  } catch (error) {
    console.error('Error setting username:', error);
    res.status(500).json({ error: 'Error setting username' });
  }
});

module.exports = router;