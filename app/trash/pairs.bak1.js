const express = require('express');
const pairsRouter = express.Router();
const Web3 = require('web3');
const FACTORYABI = require('../libs/abis/core/UniswapV2Factory.json');
const PAIRABI  = require('../libs/abis/core/IUniswapV2Pair.json');
const FACTORY='0x284937a9f5a1d28268d4e48d5eda03b04a7a1786';
const QCASH='0xf2033ede578e17fa6231047265010445bca8cf1c';
const QI='0x54fefdb5b31164f66ddb68becd7bdd864cacd65b';
const WQTUM = '0xe7e5caae57b34b93c57af9478a5130f62e3d2827';

pairsRouter.use(express.json());

pairsRouter.route('/')
.get((req,res,next) => {
    try{
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(
            {
                "ticker_id": "BTC_ETH",
                "base": "BTC",
                "target": "ETH",               
            }          
        ); 
    } 
    catch(err){
        next(err)
    }
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: POST operation not supported on /pairs/');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: PUT operation not supported on /pairs/');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: PUT operation not supported on /pairs/');
});

pairsRouter.route('/:pair')
.get(async (req,res,next) => {    
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
        const web3 = new Web3('http://qtum:testpasswd@0.0.0.0:23889');
        const addresses = await web3.eth.getAccounts();        
        const account0 = addresses[0];
        console.log("account0:", account0);        
        const factoryContract = await new web3.eth.Contract(FACTORYABI.abi, FACTORY);        
        result = await factoryContract.methods.allPairsLength().call({from : account0 , gas: 300000});
        console.log("AllPairsLength: ", result);
        let PAIR = await factoryContract.methods.getPair(token0, token1).call({from : account0 , gas: 300000});
        console.log("GetPair(): ", PAIR);
        const pairContract = await new web3.eth.Contract(PAIRABI.abi, PAIR);
        let price0CumulativeLast = await pairContract.methods.price0CumulativeLast().call({from : account0 , gas: 300000});        
        console.log("price0CumulativeLast: ", web3.utils.fromWei(price0CumulativeLast));
        let price1CumulativeLast = await pairContract.methods.price1CumulativeLast().call({from : account0 , gas: 300000});
        console.log("price1CumulativeLast: ", web3.utils.fromWei(price1CumulativeLast));
        console.log("price1CumulativeLast: ", price1CumulativeLast); 
        let reserves = await pairContract.methods.getReserves().call({from : account0 , gas: 300000}); 
        console.log("Reserves: ", reserves.toString()); 
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(
            {
                "pair": req.params.pair,
                "base_currency": "not implemented",
                "price0CumulativeLast" : price0CumulativeLast,
                "price1CumulativeLast" : price1CumulativeLast,
                "reserve0" : reserves[0],
                "reserve1" : reserves[1],
                "timestamp" : reserves[2]            
            }          
        ); 
    } 
    catch(err){
        next(err)
    }    
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: POST operation not supported on /pairs/');
})
.put((req, res, next) => {    
    res.statusCode = 403;
    res.end('QiSwap: PUT operation not supported on /pairs/');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: DELETE operation not supported on /pairs/');
});

module.exports = pairsRouter;