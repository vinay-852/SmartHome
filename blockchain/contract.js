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

let account;
try {
  // Initialize account with private key
  account = web3.eth.accounts.privateKeyToAccount(privateKey);
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
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "addUser",
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
          },
          {
            "internalType": "string",
            "name": "username",
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
    "inputs": [
      {
        "internalType": "string",
        "name": "deviceID",
        "type": "string"
      }
    ],
    "name": "getLogsByDevice",
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
          },
          {
            "internalType": "string",
            "name": "username",
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
    "inputs": [
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      }
    ],
    "name": "getLogsByUser",
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
          },
          {
            "internalType": "string",
            "name": "username",
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
      },
      {
        "internalType": "string",
        "name": "username",
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
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      }
    ],
    "name": "revokeUserAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "userAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "userAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
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

// Function to add a new user
async function addUser(username, userAddress) {
  try {
    const tx = contract.methods.addUser(username, userAddress);
    const gas = await tx.estimateGas({ from: account.address });
    const receipt = await tx.send({ from: account.address, gas });
    console.log('User added:', username);
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

// Function to fetch logs by device ID
async function getLogsByDevice(deviceID) {
  try {
    const logs = await contract.methods.getLogsByDevice(deviceID).call();
    return logs.map(log => ({
      user: log.user,
      timestamp: new Date(log.timestamp * 1000).toISOString(),
      deviceID: log.deviceID,
      action: log.action,
      username: log.username
    }));
  } catch (error) {
    console.error('Error fetching logs by device:', error);
    throw error;
  }
}

// Function to fetch logs by username
async function getLogsByUser(username) {
  try {
    const logs = await contract.methods.getLogsByUser(username).call();
    return logs.map(log => ({
      user: log.user,
      timestamp: new Date(log.timestamp * 1000).toISOString(),
      deviceID: log.deviceID,
      action: log.action,
      username: log.username
    }));
  } catch (error) {
    console.error('Error fetching logs by user:', error);
    throw error;
  }
}

// Function to revoke user access
async function revokeUserAccess(username) {
  try {
    const tx = contract.methods.revokeUserAccess(username);
    const gas = await tx.estimateGas({ from: account.address });
    const receipt = await tx.send({ from: account.address, gas });
    console.log('User access revoked:', username);
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error revoking user access:', error);
    throw error;
  }
}

// Function to get the contract owner
async function getOwner() {
  try {
    const owner = await contract.methods.owner().call();
    console.log('Contract owner:', owner);
    return owner;
  } catch (error) {
    console.error('Error fetching contract owner:', error);
    throw error;
  }
}

// Function to check if a user has access
async function checkUserAccess(username) {
  try {
    const hasAccess = await contract.methods.userAccess(username).call();
    console.log('User access:', hasAccess);
    return hasAccess;
  } catch (error) {
    console.error('Error checking user access:', error);
    throw error;
  }
}

// Function to get the address of a user
async function getUserAddress(username) {
  try {
    const address = await contract.methods.userAddresses(username).call();
    console.log('User address:', address);
    return address;
  } catch (error) {
    console.error('Error fetching user address:', error);
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
module.exports = { 
  setUsername, 
  logAccess, 
  getLogs, 
  addUser, 
  getLogsByDevice, 
  getLogsByUser, 
  revokeUserAccess, 
  getOwner, 
  checkUserAccess, 
  getUserAddress 
};