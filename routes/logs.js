const express = require('express');
const router = express.Router();
const { 
  logAccess, 
  getLogs,
  addUser, 
  getLogsByDevice, 
  getLogsByUser, 
  revokeUserAccess, 
  getOwner, 
  checkUserAccess, 
  getUserAddress,
  updateUser,
  getDeviceStatus,
  getAllUsers
} = require('../blockchain/contract');

// Route to log an access attempt
router.post('/logAccess', async (req, res) => {
  const { deviceID, action, username } = req.body;

  if (!deviceID || !action || !username) {
    return res.status(400).json({ error: 'Missing required fields: deviceID, action, and username' });
  }

  try {
    const txHash = await logAccess(deviceID, action, username);
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

// Route to add a new user
router.post('/addUser', async (req, res) => {
  const { username, userAddress } = req.body;

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

// Route to update a user
router.post('/updateUser', async (req, res) => {
  const { username, newAddress } = req.body;

  if (!username || !newAddress) {
    return res.status(400).json({ error: 'Missing required fields: username and newAddress' });
  }

  try {
    const txHash = await updateUser(username, newAddress);
    res.status(200).json({ message: 'User updated successfully', txHash });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Route to get the status of a device
router.get('/getDeviceStatus', async (req, res) => {
  const { deviceID } = req.query;

  if (!deviceID) {
    return res.status(400).json({ error: 'Missing required field: deviceID' });
  }

  try {
    const status = await getDeviceStatus(deviceID);
    res.status(200).json({ status });
  } catch (error) {
    console.error('Error fetching device status:', error);
    res.status(500).json({ error: 'Error fetching device status' });
  }
});

// Route to get all users
router.get('/getAllUsers', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Error fetching all users' });
  }
});

module.exports = router;