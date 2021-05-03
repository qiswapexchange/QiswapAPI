const express = require('express');
const tickerRouter = express.Router();

tickerRouter.use(express.json());

tickerRouter.route('/')
.get((req,res,next) => {
    try{
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(
            {
                "ticker_id": "BTC_ETH",
                "base_currency": "BTC",
                "target_currency": "ETH",
                "last_price":"50.0",
                "base_volume":"10",
                "target_volume":"500",
                "bid":"49.9",
                "ask":"50.1",
                "high":"51.3",
                "low":"49.2"
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
    res.end('QiSwap: PUT operation not supported on /tickers/');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: PUT operation not supported on /tickers/');
});

tickerRouter.route('/:tickerId')
.get((req,res,next) => {
    try{
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(
            {
                "ticker_id": req.params.tickerId,
                "base_currency": req.params.tickerId,
                "target_currency": "ETH",
                "last_price":"50.0",
                "base_volume":"10",
                "target_volume":"500",
                "bid":"49.9",
                "ask":"50.1",
                "high":"51.3",
                "low":"49.2"
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

module.exports = tickerRouter;