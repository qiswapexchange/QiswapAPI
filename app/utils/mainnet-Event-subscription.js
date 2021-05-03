const Web3 = require('web3');
const FACTORYABI = require('../libs/abis/core/UniswapV2Factory.json');
const PAIRABI  = require('../libs/abis/core/IUniswapV2Pair.json');
const FACTORY='0x284937a9f5a1d28268d4e48d5eda03b04a7a1786';
const QCASH='0xf2033ede578e17fa6231047265010445bca8cf1c';
const QI='0x54fefdb5b31164f66ddb68becd7bdd864cacd65b';
//const QTUMM = '0x84e13bc19dbc064666bf00457adc748bb90f582d';
const WQTUM = '0xe7e5caae57b34b93c57af9478a5130f62e3d2827';

const testWeb3 = async () => {
    try{
        let result;
        const web3 = new Web3('http://qtum:testpasswd@0.0.0.0:23889');
        const addresses = await web3.eth.getAccounts();        
        const account0 = addresses[0];
        console.log("account0:", account0);
        const factoryContract = await new web3.eth.Contract(FACTORYABI.abi, FACTORY);
        let PAIR = await factoryContract.methods.getPair(WQTUM, QCASH).call({from : account0 , gas: 300000});
        console.log("GetPair(): ", PAIR);
        const pairContract = await new web3.eth.Contract(PAIRABI.abi, PAIR);
        console.log("getting Events");
        result = await pairContract.events.allEvents({            
            fromBlock: 835500
        }, function(error, event){ console.log(event); })
        .on("connected", function(subscriptionId){
            console.log('onConnected -> SubscriptionId:\n' , subscriptionId);
        })
        .on('data', function(event){
            console.log('onData -> Event:\n', event); // same results as the optional callback above
        })
        .on('changed', function(event){
            console.log('onChanged-> Event:\n', event);
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log('onError-> Error:\n', error, '\n on Error-> receipt:', receipt);
        });        

    } catch (err){
        console.log("Web3 Test script error: \n", err);
    }
}

testWeb3();