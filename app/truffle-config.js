const TestRPC = require('ganache-cli')

module.exports = {
    networks: {
        development: {
            provider: TestRPC.provider(),
            network_id: '*'
        },
        testnet: {
            host: 'qtum:testpasswd@0.0.0.0',
            port: 23889,
            network_id: '*',
            gasPrice: "0x64"
        },
        mainnet: {
            host: 'qtum:testpasswd@0.0.0.0',
            port: 23889,
            network_id: '*',
            //gasPrice: "0x64"
        }        
    },
    plugins: ["solidity-coverage"],
    compilers: {
        solc: {
            version: '^0.6.0',
            settings: {
                optimizer: {
                    enabled: true
                }
            }
        }
    }
}