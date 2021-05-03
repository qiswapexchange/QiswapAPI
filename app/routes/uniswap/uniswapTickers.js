const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const chainId = ChainId.MAINNET;
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F" //DAI token on mainnet
const USDT = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

const express = require('express');
const tickerRouter = express.Router();

tickerRouter.use(express.json());

tickerRouter.route('/:pair')
.get(async (req,res,next) => {    
    try{        
        let tokens = req.params.pair.split("_");
        let tokenAddress;
        switch (tokens[0]){
            case "DAI" : 
                tokenAddress = DAI;
                break;
            case "USDT":
                tokenAddress = USDT;
                break;
            default:
                res.statusCode = 404;
                res.end('Wrong pair');
                return;                
        }
        const token = await Fetcher.fetchTokenData(chainId, tokenAddress); //creates a token object from Mainnet
        const weth = WETH[chainId]; //creates a WETH object from Mainnet (using the SDK object)
        const pair = await Fetcher.fetchPairData(token, weth); // returns the pair
        const route = new Route([pair], weth); // creates a route using WETH as reference token
        
        console.log("WETH / Dai pair price: ", route.midPrice.toSignificant(6)); //gets the most 6 significant digits for DAI/WETH
        console.log("Dai / WETH pair price: ", route.midPrice.invert().toSignificant(6)); // inverts the rate WETH/DAI
    
        const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
    
        console.log("TradeExecutionPrice for 100.000.000.000.000.000 gwei: ",trade.executionPrice.toSignificant(6));
        console.log("TradeMidPrice for 100.000.000.000.000.000 gwei: ",trade.nextMidPrice.toSignificant(6));    
        
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(
            {
                "ticker_id": req.params.pair,
                "base_currency": req.params.pair,
                "trade_mid_price" : route.midPrice.toSignificant(6),
                "trade_execution_price" : trade.nextMidPrice.toSignificant(6)
            }          
        ); 
    } 
    catch(err){
        next(err)
    }    
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: POST operation not supported on /tickers/');
})
.put((req, res, next) => {    
    res.statusCode = 403;
    res.end('QiSwap: POST operation not supported on /tickers/');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: POST operation not supported on /tickers/');
});

tickerRouter.route('/')

/* GET UNISWAP home page. */
tickerRouter.get('/', function(req, res, next) {
    res.render('index', { title: 'UNISWAP API' });
  })
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: POST operation not supported on /tickers/');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: PUT operation not supported on /tickers/');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: PUT operation not supported on /tickers/');
});



module.exports = tickerRouter;