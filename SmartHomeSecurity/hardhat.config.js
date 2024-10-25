require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: process.env.ENDPOINT_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};