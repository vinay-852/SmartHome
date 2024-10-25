const ethers = require('ethers');
require('dotenv').config();

if (!process.env.ENDPOINT_URL) {
  throw new Error('ENDPOINT_URL is not defined in the environment variables');
}

const provider = new ethers.providers.JsonRpcProvider(process.env.ENDPOINT_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "deviceID",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "action",
        "type": "string"
      }
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
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "deviceID",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "action",
            "type": "string"
          }
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "deviceID",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "action",
        "type": "string"
      }
    ],
    "name": "AccessAttempt",
    "type": "event"
  }
];

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function logAccess(deviceID, action) {
  try {
    const tx = await contract.logAccess(deviceID, action);
    await tx.wait();
    console.log('Access logged:', tx.hash);
    return tx.hash;
  } catch (error) {
    console.error('Error logging access:', error);
    throw error;
  }
}

async function getLogs() {
  try {
    const logs = await contract.getLogs();
    return logs.map(log => ({
      user: log.user,
      timestamp: log.timestamp,
      deviceID: log.deviceID,
      action: log.action
    }));
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
}

module.exports = { logAccess, getLogs };
