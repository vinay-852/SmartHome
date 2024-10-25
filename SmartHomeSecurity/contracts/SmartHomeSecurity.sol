// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartHomeSecurity {
    struct AccessLog {
        address user;
        uint256 timestamp;
        string deviceID;
        string action;
    }

    AccessLog[] public logs;

    event AccessAttempt(address indexed user, uint256 timestamp, string deviceID, string action);

    function logAccess(string memory deviceID, string memory action) public {
        logs.push(AccessLog(msg.sender, block.timestamp, deviceID, action));
        emit AccessAttempt(msg.sender, block.timestamp, deviceID, action);
    }

    function getLogs() public view returns (AccessLog[] memory) {
        return logs;
    }
}
