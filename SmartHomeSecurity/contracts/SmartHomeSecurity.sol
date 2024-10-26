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

    AccessLog[] public logs;

    // Mapping to store usernames for each account
    mapping(address => string) public usernames;

    // Event for access attempt, including username
    event AccessAttempt(address indexed user, uint256 timestamp, string deviceID, string action, string username);

    // Function to set username for an account
    function setUsername(string memory _username) public {
        usernames[msg.sender] = _username;
    }

    // Log access with device ID, action, and username
    function logAccess(string memory deviceID, string memory action) public {
        // Retrieve the username of the caller
        string memory username = usernames[msg.sender];

        logs.push(AccessLog(msg.sender, block.timestamp, deviceID, action, username));
        emit AccessAttempt(msg.sender, block.timestamp, deviceID, action, username);
    }

    // Function to get all logs
    function getLogs() public view returns (AccessLog[] memory) {
        return logs;
    }

    // Function to get a user's username
    function getUsername(address user) public view returns (string memory) {
        return usernames[user];
    }
}
