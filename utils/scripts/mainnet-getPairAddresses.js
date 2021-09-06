const Web3 = require('web3');
const FACTORYABI = require('../libs/abis/core/UniswapV2Factory.json');

const ERC20 = require('../libs/abis/core/ERC20.json');
const PAIR  = require('../libs/abis/core/IUniswapV2Pair.json');
const FACTORY_ADDRESS='0x284937a9f5a1d28268d4e48d5eda03b04a7a1786';
const FACTORY='0x284937a9f5a1d28268d4e48d5eda03b04a7a1786';

const QCASH='0xf2033ede578e17fa6231047265010445bca8cf1c';
const QI='0x54fefdb5b31164f66ddb68becd7bdd864cacd65b';
//const QTUMM = '0x84e13bc19dbc064666bf00457adc748bb90f582d';
const WQTUM = '0xe7e5caae57b34b93c57af9478a5130f62e3d2827';
const accountX='0x1b520a60823fe02510eebeb2c8f450a244d88e6a';
const JANUS = 'http://qtum:testpasswd@0.0.0.0:23889';
const httpProvider = (process.env.HTTPPROVIDER || JANUS);

const main = async () => {
    try{
        let result;
        console.log("HTTP Provider: ", httpProvider);
        const web3 = new Web3(JANUS);
        const addresses = await web3.eth.getAccounts();        
        const account0 = addresses[0];
        console.log("account[0]:", account0);
        console.log("Janus accounts:", addresses);
        const networkId = await web3.eth.net.getId();
        console.log("networkId:", networkId);
        const factoryContract = await new web3.eth.Contract(FACTORYABI.abi, FACTORY);
    	//console.log("factoryContract:", factoryContract);
	    console.log("calling method allPairsLength with address:", account0);
        pairsLength = await factoryContract.methods.allPairsLength().call({from : account0 , gas: 300000});
        let pairs = [];
        for (let i=0; i< pairsLength ; i++){
            let PAIR_ADDRESS = await factoryContract.methods.allPairs(i).call({from : account0 , gas: 300000});            
            let pairContract = await new web3.eth.Contract(PAIR.abi, PAIR_ADDRESS);
            let TOKEN0_ADDRESS = await pairContract.methods.token0().call({from : account0 , gas: 300000}); 
            let TOKEN1_ADDRESS = await pairContract.methods.token1().call({from : account0 , gas: 300000}); 
            let token0Contract = await new web3.eth.Contract(ERC20.abi, TOKEN0_ADDRESS);
            let token1Contract = await new web3.eth.Contract(ERC20.abi, TOKEN1_ADDRESS);

            let token0Name = await token0Contract.methods.name().call({from : account0 , gas: 300000}); 
            let token0Symbol = await token0Contract.methods.symbol().call({from : account0 , gas: 300000});
            let token1Name = await token1Contract.methods.name().call({from : account0 , gas: 300000}); 
            let token1Symbol = await token1Contract.methods.symbol().call({from : account0 , gas: 300000}); 
 
            let reserves = await pairContract.methods.getReserves().call({from : account0 , gas: 300000}); 
            let pair = { 
                "pair" : `${token0Symbol}_${token1Symbol}`, 
                "pair_address" : PAIR_ADDRESS, 
                "token0_symbol" : token0Symbol,
                "token0_name" : token0Name,
                "token0_reserves" : reserves[0],
                "token1_symbol" : token1Symbol,
                "token1_name" : token1Name,
                "token1_reserves" : reserves[1]
            }
            pairs[i]=pair;
        }
        console.log("Pairs found:\n", JSON.stringify(pairs));

        console.log("Pairs found:\n", pairs);

    } catch (err){
        console.log("Web3 Test script error: \n", err);
    }
}

main();