const Web3 = require('web3');
const FACTORYABI = require('../libs/abis/core/UniswapV2Factory.json');
const PAIRABI  = require('../libs/abis/core/IUniswapV2Pair.json');
const FACTORY='0x284937a9f5a1d28268d4e48d5eda03b04a7a1786';
const QCASH='0xf2033ede578e17fa6231047265010445bca8cf1c';
const QI='0x54fefdb5b31164f66ddb68becd7bdd864cacd65b';
//const QTUMM = '0x84e13bc19dbc064666bf00457adc748bb90f582d';
const WQTUM = '0xe7e5caae57b34b93c57af9478a5130f62e3d2827';
const accountX='0x1b520a60823fe02510eebeb2c8f450a244d88e6a';

const testWeb3 = async () => {
    try{
        let result;
        const web3 = new Web3('http://qtum:testpasswd@0.0.0.0:23889');
        const addresses = await web3.eth.getAccounts();        
        const account0 = addresses[0];
        console.log("Janus accounts:", addresses);
        const networkId = await web3.eth.net.getId();
        console.log("networkId:", networkId);
        const factoryContract = await new web3.eth.Contract(FACTORYABI.abi, FACTORY);
	//console.log("factoryContract:", factoryContract);
	console.log("calling method allPairsLength with address:", accountX);
        result = await factoryContract.methods.allPairsLength().call({from : accountX , gas: 300000});
        console.log("AllPairsLength: ", result);
        let PAIR = await factoryContract.methods.getPair(WQTUM, QCASH).call({from : accountX , gas: 300000});
        console.log("GetPair(): ", PAIR);
        const pairContract = await new web3.eth.Contract(PAIRABI.abi, PAIR);
        let price0CumulativeLast = await pairContract.methods.price0CumulativeLast().call({from : accountX , gas: 300000});        
        console.log("price0CumulativeLast: ", web3.utils.fromWei(price0CumulativeLast));
        let price1CumulativeLast = await pairContract.methods.price1CumulativeLast().call({from : accountX , gas: 300000});
        console.log("price1CumulativeLast: ", web3.utils.fromWei(price1CumulativeLast));
        console.log("price1CumulativeLast: ", price1CumulativeLast);


    } catch (err){
        console.log("Web3 Test script error: \n", err);
    }
}

testWeb3();
