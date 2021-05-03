const express = require('express');
const orderbookRouter = express.Router();

orderbookRouter.use(express.json());

orderbookRouter.route('/')
.get((req,res,next) => {
    try{
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(
            {
                "ticker_id": req.query.ticker_id,
                "depth": req.query.depth,
                "timestamp":"1700050000",
                "bids":[  
                   [  
                      "49.8",
                      "0.50000000"
                   ],
                   [  
                      "49.9",
                      "6.40000000"
                   ]
                ],
                "asks":[  
                   [  
                      "50.1",
                      "9.20000000"
                   ],
                   [  
                      "50.2",
                      "7.9000000"
                   ]
                ]
            }          
        ); 
    } 
    catch(err){
        next(err)
    }
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: POST operation not supported on /orderbook/');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: PUT operation not supported on /orderbook/');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('QiSwap: PUT operation not supported on /orderbook/');
});


module.exports = orderbookRouter;