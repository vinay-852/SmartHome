const { Web3 } = require('web3');
require('dotenv').config();

// Define Web3 endpoint URL and initialize Web3 instance
const endpointUrl = process.env.ENDPOINT_URL || "https://smart-skilled-spree.ethereum-sepolia.quiknode.pro/71f0788a41742f9e711dd11ea1fb9e0b78c1bb34/";
const web3 = new Web3(endpointUrl);

// Check if necessary environment variables are set
if (!process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
  throw new Error('Environment variables PRIVATE_KEY or CONTRACT_ADDRESS are missing');
}

// Ensure the private key is properly formatted
const privateKey = process.env.PRIVATE_KEY;

try {
  // Initialize account with private key
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  console.log('Account successfully added:', account.address);
} catch (error) {
  console.error('Error initializing account:', error);
  throw error;
}

// Define contract ABI and initialize contract instance
const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "deviceID", "type": "string" },
      { "internalType": "string", "name": "action", "type": "string" }
    ],
    "name": "logAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLogs",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "user", "type": "address" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "deviceID", "type": "string" },
          { "internalType": "string", "name": "action", "type": "string" },
          { "internalType": "string", "name": "username", "type": "string" }
        ],
        "internalType": "struct SmartHomeSecurity.AccessLog[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_username", "type": "string" }],
    "name": "setUsername",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "deviceID", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "action", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "username", "type": "string" }
    ],
    "name": "AccessAttempt",
    "type": "event"
  }
];
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to set a username
async function setUsername(username) {
  try {
    const tx = contract.methods.setUsername(username);
    const gas = await tx.estimateGas({ from: account.address });
    const receipt = await tx.send({ from: account.address, gas });
    console.log('Username set:', username);
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error setting username:', error);
    throw error;
  }
}

// Function to log access with deviceID and action
async function logAccess(deviceID, action) {
  try {
    const tx = contract.methods.logAccess(deviceID, action);
    const gas = await tx.estimateGas({ from: account.address });
    const receipt = await tx.send({ from: account.address, gas });
    console.log('Access logged:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error logging access:', error);
    throw error;
  }
}

// Function to fetch all logs
async function getLogs() {
  try {
    const logs = await contract.methods.getLogs().call();
    return logs.map(log => ({
      user: log.user,
      timestamp: new Date(log.timestamp * 1000).toISOString(), // Convert timestamp to readable format
      deviceID: log.deviceID,
      action: log.action,
      username: log.username
    }));
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
}

// Function to fetch the current block number
async function fetchBlockNumber() {
  try {
    const currentBlockNumber = await web3.eth.getBlockNumber();
    console.log('Current block number:', currentBlockNumber);
  } catch (error) {
    console.error('Error fetching block number:', error);
  }
}

// Fetch current block number upon script execution
fetchBlockNumber();

// Export functions for use in other files
module.exports = { setUsername, logAccess, getLogs };
