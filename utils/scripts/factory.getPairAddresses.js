const Web3 = require('web3');
const {FACTORY, FACTORY_ADDRESS, PAIR, ERC20 }=require('../constants');
const {HTTPPROVIDER} = require('../config');

const main = async () => {
    try{
        let result;
        const web3 = new Web3(HTTPPROVIDER);
        const addresses = await web3.eth.getAccounts();        
        const account0 = addresses[0];
        console.log("account[0]:", account0);
        console.log("Janus accounts:", addresses);
        const networkId = await web3.eth.net.getId();
        console.log("networkId:", networkId);
        const factoryContract = await new web3.eth.Contract(FACTORY.abi, FACTORY_ADDRESS);
	console.log("calling method allPairsLength with address:", account0);
        pairsLength = await factoryContract.methods.allPairsLength().call({from : account0 , gas: 300000});
	console.log("Pairs length: ", pairsLength);
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
	    console.log(`Pair(${token0Symbol}-${token1Symbol}) address: ${PAIR_ADDRESS}`); 
	    console.log(`Token0: ${token0Symbol} // Address: ${TOKEN0_ADDRESS}`);
	    console.log(`Token1: ${token1Symbol} // Address: ${TOKEN1_ADDRESS}\n`);
 
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
        //console.log("Pairs found:\n", pairs);

    } catch (err){
        console.log("Web3 Test script error: \n", err);
    }
}

main();
