const SmartContract = artifacts.require("Euphorai");

module.exports = function (deployer) {
  deployer.deploy(SmartContract, "EuphorAI", "EUPH", 
      5000, 10000000, 5, "<ipfs://<ifps_dir_url/>");
};
