const graphql = require('graphql');
const _ = require('lodash');
const Web3 = require('web3');
const { FACTORY, ERC20, PAIR, FACTORY_ADDRESS, QCASH, QI, WQTUM, JANUS} = require('../../utils/constants');
const { HTTPPROVIDER } = require('../../utils/config')
const httpProvider = (HTTPPROVIDER || JANUS);
const GASLIMIT = 300000;

const {GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLList //Used to retrieve a list of Pairs
} = graphql; 

// Mock object used for testing
// var pairs = [
//     {"pair":"TTT_WQTUM","pair_address":"0xF176CF61cBAc47DB3F63d7C94A22b959F0e53E68","token0_symbol":"TTT","token0_name":"TTT","token0_reserves":"110000000000","token1_symbol":"WQTUM","token1_name":"Wrapped QTUM","token1_reserves":"9093390"},
//     {"pair":"QSW_WQTUM","pair_address":"0x6A83993c781A72DCCFc899BC827702111b78CE00","token0_symbol":"QSW","token0_name":"QSW","token0_reserves":"1025000000","token1_symbol":"WQTUM","token1_name":"Wrapped QTUM","token1_reserves":"1"},
//     {"pair":"WQTUM_QC","pair_address":"0xb406040D9E1A9bBb19fcc803A7A808b038aE45cE","token0_symbol":"WQTUM","token0_name":"Wrapped QTUM","token0_reserves":"489288507526","token1_symbol":"QC","token1_name":"QCASH","token1_reserves":"82082186516478"},
//     {"pair":"QI_WQTUM","pair_address":"0x222b099fE58d01B2EAC666177dd06d9B0003b25c","token0_symbol":"QI","token0_name":"Qi","token0_reserves":"389837575899836779124746","token1_symbol":"WQTUM","token1_name":"Wrapped QTUM","token1_reserves":"635411302449"},
//     {"pair":"QI_QIAIR","pair_address":"0xC7fCB6E85AB13E5d04609E5c2C7b51863845aDC1","token0_symbol":"QI","token0_name":"Qi","token0_reserves":"245580434644890825","token1_symbol":"QIAIR","token1_name":"QIAIR","token1_reserves":"2105467747412671869"},
//     {"pair":"QIAIR_WQTUM","pair_address":"0x1892389bEE71BefB62686Ac94fB7fE7fd7d22169","token0_symbol":"QIAIR","token0_name":"QIAIR","token0_reserves":"4455234980759121555","token1_symbol":"WQTUM","token1_name":"Wrapped QTUM","token1_reserves":"3043188"},
//     {"pair":"TEST_WQTUM","pair_address":"0xC8966C1Da7eb1136BD2E4842fBE5beA172DA23E1","token0_symbol":"TEST","token0_name":"TEST","token0_reserves":"1480153859589","token1_symbol":"WQTUM","token1_name":"Wrapped QTUM","token1_reserves":"1"},
//     {"pair":"QI_QC","pair_address":"0x74D0a9E9E70d379E15f3b681e4c13113c7eA5865","token0_symbol":"QI","token0_name":"Qi","token0_reserves":"10154069436513894193518","token1_symbol":"QC","token1_name":"QCASH","token1_reserves":"2476065136409"}
// ]

const PairTokenDetails = new GraphQLObjectType({
    name: 'PairTokens',
    fields: {  
        pairId: {type: GraphQLString},
        pair_address: {type: GraphQLString},
        token0_symbol: {type: GraphQLString},
        token0_name: {type: GraphQLString},
        token0_reserves: {type: GraphQLString},
        token1_symbol : {type: GraphQLString},
        token1_name: {type: GraphQLString},
        token1_reserves:{type: GraphQLString},
    }
})

const Pair = new GraphQLObjectType({
    name: 'Pair',
    fields: {  
        pairId: {type: GraphQLString},
        token0_reserves: {type: GraphQLString},
        token1_reserves:{type: GraphQLString},
        timestamp:{type: GraphQLString}
    }
})


//Definition of graph root query "RootQuery"
const RootQuery = new GraphQLObjectType ({
    name: 'RootQueryType',
    fields: { 
        pair: { 
            type: Pair,
            args: { pairId : {type: GraphQLString}}, 
            resolve(parent, args){                 
                //return _.find(pairs, {pair: args.pairId}); 
                console.log("Received query for pairId:", args.pairId );
                return getPairDetail(args.pairId);
            }
        },
        pairList:{
            type: new GraphQLList(PairTokenDetails),
            resolve(parent, args){
                //return pairs;
                return getAllPairs();
            }
        },
    }

})


module.exports = new GraphQLSchema ({
    query: RootQuery
})

const getAllPairs = async () =>{
    try{
        const web3 = new Web3(httpProvider);
        const addresses = await web3.eth.getAccounts();        
        const account0 = addresses[0];               
        const factoryContract = await new web3.eth.Contract(FACTORY.abi, FACTORY_ADDRESS);        
        pairsLength = await factoryContract.methods.allPairsLength().call({from : account0 , gas: GASLIMIT});
        let pairs=[];        
        for (let i=0; i< pairsLength ; i++){
            let PAIR_ADDRESS = await factoryContract.methods.allPairs(i).call({from : account0 , gas: GASLIMIT});            
            let pairContract = await new web3.eth.Contract(PAIR.abi, PAIR_ADDRESS);
            let TOKEN0_ADDRESS = await pairContract.methods.token0().call({from : account0 , gas: GASLIMIT}); 
            let TOKEN1_ADDRESS = await pairContract.methods.token1().call({from : account0 , gas: GASLIMIT}); 
            let token0Contract = await new web3.eth.Contract(ERC20.abi, TOKEN0_ADDRESS);
            let token1Contract = await new web3.eth.Contract(ERC20.abi, TOKEN1_ADDRESS);

            let token0Name = await token0Contract.methods.name().call({from : account0 , gas: GASLIMIT}); 
            let token0Symbol = await token0Contract.methods.symbol().call({from : account0 , gas: GASLIMIT});
            let token1Name = await token1Contract.methods.name().call({from : account0 , gas: GASLIMIT}); 
            let token1Symbol = await token1Contract.methods.symbol().call({from : account0 , gas: GASLIMIT}); 
 
            let reserves = await pairContract.methods.getReserves().call({from : account0 , gas: GASLIMIT}); 
            let pair = { 
                "pairId" : `${token0Symbol}_${token1Symbol}`,                 
                "token0_symbol" : token0Symbol,
                "token0_name" : token0Name,
                "token0_reserves" : reserves[0],
                "token1_symbol" : token1Symbol,
                "token1_name" : token1Name,
                "token1_reserves" : reserves[1]
            }
            pairs[i]=pair;
        }
        return pairs;
    } 
    catch(err){
        return err;
    }    
}

const getPairDetail = async (pairId) => {
    try{        
        let tokens = pairId.toString().split("_");
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
                var error = new Error(`Pair ${pairId} not found`);
                error.http_code =  404;
                return error;
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
                var error = new Error(`Pair ${pairId} not found`);
                error.http_code =  404;
                return error;
        }
        const web3 = new Web3(httpProvider);
        const addresses = await web3.eth.getAccounts();        
        const account0 = addresses[0];        
        const factoryContract = await new web3.eth.Contract(FACTORY.abi, FACTORY_ADDRESS);        
        let PAIR_ADDRESS = await factoryContract.methods.getPair(token0, token1).call({from : account0 , gas: GASLIMIT});        
        const pairContract = await new web3.eth.Contract(PAIR.abi, PAIR_ADDRESS);
        let price0CumulativeLast = await pairContract.methods.price0CumulativeLast().call({from : account0 , gas: GASLIMIT});                
        let price1CumulativeLast = await pairContract.methods.price1CumulativeLast().call({from : account0 , gas: GASLIMIT});
        let reserves = await pairContract.methods.getReserves().call({from : account0 , gas: GASLIMIT}); 
        console.log("Reserves: ", reserves.toString());         
        let pair = {
                "pairId": pairId,
                //"price0CumulativeLast" : price0CumulativeLast,
                //"price1CumulativeLast" : price1CumulativeLast,
                "token0_reserves" : reserves[0],
                "token1_reserves" : reserves[1],
                "timestamp" : reserves[2]            
        };
        return pair;                   
    } 
    catch(err){
        return err
    }    
}