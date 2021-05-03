const Web3 = require('web3');
const Storage = require('../build/contracts/Storage.json');
privateKey='cMbgxCJrTYUqgcmiC1berh5DFrtY1KeU4PXZ6NZxgenniF1mXCRk';
address='';


const testWeb3 = async () => {
    try{
        let result;
        const web3 = new Web3('http://qtum:testpasswd@0.0.0.0:23889');
        const owner = await web3.eth.getAccounts();
        console.log("Owner:", owner);
        const networkId = await web3.eth.net.getId();
        //const contract = new web3.eth.Contract(Storage.abi, Storage.networks[networkId].address);
        //result = await web3.eth.accounts.wallet.add(privateKey);
        //console.log("wallet.add result:\n", result);
        //result = await contract.methods.setValue(9).send({from : owner, gas: 300000});

    } catch (err){
        console.log("Test script error: \n", err);
    }
}

testWeb3();