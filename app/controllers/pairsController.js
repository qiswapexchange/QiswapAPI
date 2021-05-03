const express = require('express');
const pairsRouter = express.Router();
const Web3 = require('web3');
const FACTORY = require('../libs/abis/core/UniswapV2Factory.json');
const ERC20 = require('../libs/abis/core/ERC20.json');
const PAIR  = require('../libs/abis/core/IUniswapV2Pair.json');
const FACTORY_ADDRESS='0x284937a9f5a1d28268d4e48d5eda03b04a7a1786';
const QCASH='0xf2033ede578e17fa6231047265010445bca8cf1c';
const QI='0x54fefdb5b31164f66ddb68becd7bdd864cacd65b';
const WQTUM = '0xe7e5caae57b34b93c57af9478a5130f62e3d2827';
const JANUS = 'http://qtum:testpasswd@0.0.0.0:23889';
const httpProvider = (process.env.HTTPPROVIDER || JANUS);

exports.pairDetail = async (req,res,next) => {    
    try{        
        let tokens = req.params.pair.split("_");
        let token0, token1;
        switch (tokens[0]){
            case "WQTUM" : 
                token0 = WQTUM;
                break;
            case "QCASH":
                token0 = QCASH;
                break;
            case "QI":
                token0 = QI;
                break;                
            default:
                res.statusCode = 404;
                res.end(`Pair ${req.params.pair} not found`);
                return;                
        }
        switch (tokens[1]){
            case "WQTUM" : 
                token1 = WQTUM;
                break;
            case "QCASH":
                token1 = QCASH;
                break;
            case "QI":
                token1 = QI;
                break;                
            default:
                res.statusCode = 404;
                res.end(`Pair ${req.params.pair} not found`);
                return;                
        }
        const web3 = new Web3(httpProvider);
        const addresses = await web3.eth.getAccounts();        
        const account0 = addresses[0];        
        const factoryContract = await new web3.eth.Contract(FACTORY.abi, FACTORY_ADDRESS);        
        let PAIR_ADDRESS = await factoryContract.methods.getPair(token0, token1).call({from : account0 , gas: 300000});        
        const pairContract = await new web3.eth.Contract(PAIR.abi, PAIR_ADDRESS);
        let price0CumulativeLast = await pairContract.methods.price0CumulativeLast().call({from : account0 , gas: 300000});                
        let price1CumulativeLast = await pairContract.methods.price1CumulativeLast().call({from : account0 , gas: 300000});
        let reserves = await pairContract.methods.getReserves().call({from : account0 , gas: 300000}); 
        console.log("Reserves: ", reserves.toString()); 
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(
            {
                "pair": req.params.pair,
                "price0CumulativeLast" : price0CumulativeLast,
                "price1CumulativeLast" : price1CumulativeLast,
                "reserve0" : reserves[0],
                "reserve1" : reserves[1],
                "timestamp" : reserves[2]            
            }          
        ); 
    } 
    catch(err){
        return next(err)
    }    
}

exports.pairList = async (req,res,next) => {    
    try{
        const web3 = new Web3(httpProvider);
        const addresses = await web3.eth.getAccounts();        
        const account0 = addresses[0];               
        const factoryContract = await new web3.eth.Contract(FACTORY.abi, FACTORY_ADDRESS);        
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

        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(
            {
                "pairs": pairs,
            }          
        ); 
    } 
    catch(err){
        return next(err)
    }    
}