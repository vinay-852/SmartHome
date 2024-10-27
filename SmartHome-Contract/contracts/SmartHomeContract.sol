// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartHomeSecurity {
    struct AccessLog {
        address user;
        uint256 timestamp;
        string deviceID;
        string action;
        string username;
    }

    AccessLog[] private logs;
    mapping(string => bool) public userAccess;
    mapping(string => address) public userAddresses;
    address public owner;


    constructor() {
        owner = msg.sender;
    }

    function getPresentUserAddress() public view returns (address) {
        return msg.sender;
    }

    function addUser(string memory username, address userAddress, address presentUser) public {
        require(presentUser == owner, "Only owner can execute");
        require(!userAccess[username], "User already has access");
        require(userAddresses[username] == address(0), "User address already assigned");
        userAccess[username] = true;
        userAddresses[username] = userAddress;
    }

    function revokeUserAccess(string memory username, address presentUser) public  {
        require(presentUser == owner, "Only owner can execute");
        require(userAccess[username], "User does not have access");
        userAccess[username] = false;
        userAddresses[username] = address(0);
    }

    function logAccess(string memory deviceID, string memory action, string memory username) public {
        require(userAccess[username] == true, "Unauthorized user");
        logs.push(AccessLog(msg.sender, block.timestamp, deviceID, action, username));
    }

    function getLogs() public view returns (AccessLog[] memory) {
        return logs;
    }

    function getLogsByDevice(string memory deviceID) public view returns (AccessLog[] memory) {
        uint256 count = _countLogsByDevice(deviceID);
        AccessLog[] memory deviceLogs = new AccessLog[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < logs.length; i++) {
            if (keccak256(abi.encodePacked(logs[i].deviceID)) == keccak256(abi.encodePacked(deviceID))) {
                deviceLogs[index] = logs[i];
                index++;
            }
        }
        return deviceLogs;
    }

    function getLogsByUser(string memory username) public view returns (AccessLog[] memory) {
        uint256 count = _countLogsByUser(username);
        AccessLog[] memory userLogs = new AccessLog[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < logs.length; i++) {
            if (keccak256(abi.encodePacked(logs[i].username)) == keccak256(abi.encodePacked(username))) {
                userLogs[index] = logs[i];
                index++;
            }
        }
        return userLogs;
    }

    function _countLogsByDevice(string memory deviceID) private view returns (uint256 count) {
        for (uint256 i = 0; i < logs.length; i++) {
            if (keccak256(abi.encodePacked(logs[i].deviceID)) == keccak256(abi.encodePacked(deviceID))) {
                count++;
            }
        }
    }

    function _countLogsByUser(string memory username) private view returns (uint256 count) {
        for (uint256 i = 0; i < logs.length; i++) {
            if (keccak256(abi.encodePacked(logs[i].username)) == keccak256(abi.encodePacked(username))) {
                count++;
            }
        }
    }
}
