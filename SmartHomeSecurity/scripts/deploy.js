
async function main() {
    const SmartHomeSecurity = await ethers.getContractFactory("SmartHomeSecurity");
    const smartHomeSecurity = await SmartHomeSecurity.deploy();
  
    await smartHomeSecurity.deployed();
    console.log("SmartHomeSecurity deployed to:", smartHomeSecurity.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  