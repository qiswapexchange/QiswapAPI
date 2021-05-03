const { default: Web3 } = require("web3");

const Storage = artifacts.require("Storage");
module.exports = async function (deployer, networks, accounts) {  
  await new Promise((resolve, reject) => {
    setTimeout(() => { 
       console.log("Hello World");
       resolve();
    }, 10 * 1000);        
 });
  let balance = await web3.eth.getBalance(accounts[0]);
  console.log("\n--> Migrating from address: ", accounts[0], " with balance: ", balance.toString(), "\n");
  deployer.deploy(Storage, {from : accounts[0], gas: 39000000});
};