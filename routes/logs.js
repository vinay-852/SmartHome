const express = require('express');
const router = express.Router();
const { 
  logAccess, 
  getLogs, 
  setUsername, 
  addUser, 
  getLogsByDevice, 
  getLogsByUser, 
  revokeUserAccess, 
  getOwner, 
  checkUserAccess, 
  getUserAddress 
} = require('../blockchain/contract');

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

// Route to add a new user
router.post('/addUser', async (req, res) => {
  const { username, userAddress } = req.body;

  // Validate input
  if (!username || !userAddress) {
    return res.status(400).json({ error: 'Missing required fields: username and userAddress' });
  }

  try {
    const txHash = await addUser(username, userAddress);
    res.status(200).json({ message: 'User added successfully', txHash });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Error adding user' });
  }
});

// Route to retrieve logs by device ID
router.get('/getLogsByDevice', async (req, res) => {
  const { deviceID } = req.query;

  // Validate input
  if (!deviceID) {
    return res.status(400).json({ error: 'Missing required field: deviceID' });
  }

  try {
    const logs = await getLogsByDevice(deviceID);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error retrieving logs by device:', error);
    res.status(500).json({ error: 'Error retrieving logs by device' });
  }
});

// Route to retrieve logs by username
router.get('/getLogsByUser', async (req, res) => {
  const { username } = req.query;

  // Validate input
  if (!username) {
    return res.status(400).json({ error: 'Missing required field: username' });
  }

  try {
    const logs = await getLogsByUser(username);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error retrieving logs by user:', error);
    res.status(500).json({ error: 'Error retrieving logs by user' });
  }
});

// Route to revoke user access
router.post('/revokeUserAccess', async (req, res) => {
  const { username } = req.body;

  // Validate input
  if (!username) {
    return res.status(400).json({ error: 'Missing required field: username' });
  }

  try {
    const txHash = await revokeUserAccess(username);
    res.status(200).json({ message: 'User access revoked successfully', txHash });
  } catch (error) {
    console.error('Error revoking user access:', error);
    res.status(500).json({ error: 'Error revoking user access' });
  }
});

// Route to get the contract owner
router.get('/getOwner', async (req, res) => {
  try {
    const owner = await getOwner();
    res.status(200).json({ owner });
  } catch (error) {
    console.error('Error fetching contract owner:', error);
    res.status(500).json({ error: 'Error fetching contract owner' });
  }
});

// Route to check if a user has access
router.get('/checkUserAccess', async (req, res) => {
  const { username } = req.query;

  // Validate input
  if (!username) {
    return res.status(400).json({ error: 'Missing required field: username' });
  }

  try {
    const hasAccess = await checkUserAccess(username);
    res.status(200).json({ hasAccess });
  } catch (error) {
    console.error('Error checking user access:', error);
    res.status(500).json({ error: 'Error checking user access' });
  }
});

// Route to get the address of a user
router.get('/getUserAddress', async (req, res) => {
  const { username } = req.query;

  // Validate input
  if (!username) {
    return res.status(400).json({ error: 'Missing required field: username' });
  }

  try {
    const address = await getUserAddress(username);
    res.status(200).json({ address });
  } catch (error) {
    console.error('Error fetching user address:', error);
    res.status(500).json({ error: 'Error fetching user address' });
  }
});

module.exports = router;