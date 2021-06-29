const ethers = require('ethers');
const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const chainId = ChainId.MAINNET;

const network = "homestead";
const provider = ethers.getDefaultProvider(network, {    
    alchemy: "AecHOpLKKd6QYb5aHe46hPLpaK1pgkel"
});

const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F" //DAI token on mainnet
//const tokenAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; //TUSD token on mainnet

const init = async () =>{

    const dai = await Fetcher.fetchTokenData(chainId, tokenAddress); //creates a Dai object from Mainnet
    const weth = WETH[chainId]; //creates a WETH object from Mainnet (using the SDK object)

    const pair = await Fetcher.fetchPairData(dai, weth); // returns the pair
    console.log('Pair data token[0]: \n', pair.tokenAmounts[0].token);
    console.log('Pair data token[1]: \n', pair.tokenAmounts[1].token);
    console.log('Pair data liquidtyToken: \n', pair.liquidityToken);
    //console.log('Pair data token[0]: ', pair.tokenAmounts[0].TokenAmount.token, pair.tokenAmounts[0].TokenAmount.currency);
    //console.log('Pair data token[1]: ', pair.tokenAmounts[1].TokenAmount.token, pair.tokenAmounts[0].TokenAmount.currency);

    const route = new Route([pair], weth); // creates a route using WETH as reference token
    
    console.log("WETH / Dai pair price: ", route.midPrice.toSignificant(6)); //gets the most 6 significant digits for DAI/WETH
    console.log("Dai / WETH pair price: ", route.midPrice.invert().toSignificant(6)); // inverts the rate WETH/DAI

    const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);

    console.log("TradeExecutionPrice for 100.000.000.000.000.000 gwei: ",trade.executionPrice.toSignificant(6));
    console.log("TradeMidPrice for 100.000.000.000.000.000 gwei: ",trade.nextMidPrice.toSignificant(6));

}

init()