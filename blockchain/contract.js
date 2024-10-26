const { Web3 } = require('web3');
require('dotenv').config();

const endpointUrl = process.env.ENDPOINT_URL || "https://lingering-yolo-season.ethereum-holesky.quiknode.pro/419898ad8962621fa60817b673f86edac2e3fe64";
const web3 = new Web3(endpointUrl);

if (!process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
  throw new Error('Environment variables PRIVATE_KEY or CONTRACT_ADDRESS are missing');
}

const privateKey = process.env.PRIVATE_KEY;
let account;
try {
  account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  console.log('Account successfully added:', account.address);
} catch (error) {
  console.error('Error initializing account:', error);
  throw error;
}

const contractABI = 
  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
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
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
      "name": "AccessLogged",
      "type": "event"
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

async function logAccess(deviceID, action, username) {
  try {
    const tx = contract.methods.logAccess(deviceID, action, username);
    const gas = await tx.estimateGas({ from: account.address });
    const receipt = await tx.send({ from: account.address, gas });
    console.log('Access logged:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error logging access:', error);
    throw error;
  }
}

async function getLogs() {
  try {
    const logs = await contract.methods.getLogs().call();
    return logs;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
}

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

async function updateUser(username, newAddress) {
  try {
    const tx = contract.methods.updateUser(username, newAddress);
    const gas = await tx.estimateGas({ from: account.address });
    const receipt = await tx.send({ from: account.address, gas });
    console.log('User updated:', username);
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function getDeviceStatus(deviceID) {
  try {
    const status = await contract.methods.getDeviceStatus(deviceID).call();
    console.log('Device status:', status);
    return status;
  } catch (error) {
    console.error('Error fetching device status:', error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const users = await contract.methods.getAllUsers().call();
    return users.map(user => ({
      username: user.username,
      userAddress: user.userAddress
    }));
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

async function fetchBlockNumber() {
  try {
    const currentBlockNumber = await web3.eth.getBlockNumber();
    console.log('Current block number:', currentBlockNumber);
  } catch (error) {
    console.error('Error fetching block number:', error);
  }
}

fetchBlockNumber();

module.exports = { 
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
};