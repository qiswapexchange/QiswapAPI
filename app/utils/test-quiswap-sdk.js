const ethers = require('ethers');
const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('qiswap/sdk');
const chainId = ChainId.MAINNET;
const FACTORYABI = require('../libs/abis/core/UniswapV2Factory.json');
const PAIRABI  = require('../libs/abis/core/IUniswapV2Pair.json');
const FACTORY='0x284937a9f5a1d28268d4e48d5eda03b04a7a1786';
const QCASH='0xf2033ede578e17fa6231047265010445bca8cf1c';
const QI='0x54fefdb5b31164f66ddb68becd7bdd864cacd65b';
//const QTUMM = '0x84e13bc19dbc064666bf00457adc748bb90f582d';
const WQTUM = '0xe7e5caae57b34b93c57af9478a5130f62e3d2827';


const provider = ethers.getDefaultProvider('http://qtum:testpasswd@0.0.0.0:23889');
const init = async () =>{
    try {
        console.log('Provider: ', provider);
        const pair = await Fetcher.fetchPairData(QI, WQTUM, provider); // returns the pair
        console.log('Pair data token[0]: \n', pair.tokenAmounts[0].token);
        console.log('Pair data token[1]: \n', pair.tokenAmounts[1].token);
        console.log('Pair data liquidtyToken: \n', pair.liquidityToken);
        //console.log('Pair data token[0]: ', pair.tokenAmounts[0].TokenAmount.token, pair.tokenAmounts[0].TokenAmount.currency);
        //console.log('Pair data token[1]: ', pair.tokenAmounts[1].TokenAmount.token, pair.tokenAmounts[0].TokenAmount.currency);
    
        const route = new Route([pair], QI); // creates a route using WETH as reference token
        
        console.log("Qi / WQTUM pair price: ", route.midPrice.toSignificant(6)); //gets the most 6 significant digits for DAI/WETH
        console.log("WQTUM / Qi pair price: ", route.midPrice.invert().toSignificant(6)); // inverts the rate WETH/DAI
    
        const trade = new Trade(route, new TokenAmount(QI, '100000000000000'), TradeType.EXACT_INPUT);
    
        console.log("TradeExecutionPrice for 100.000.000.000.000 gwei: ",trade.executionPrice.toSignificant(6));
        console.log("TradeMidPrice for 100.000.000.000.000 gwei: ",trade.nextMidPrice.toSignificant(6));    
    } catch (err){
        console.log('Error on qiswap script:\n', err);
    }

}

init()