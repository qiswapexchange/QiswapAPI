
const ZERO_ADDRESS = '0000000000000000000000000000000000000000'
const CHAIN_ID = {
  0: 'MainNet',
  1: 'TestNet',
  2: 'RegTest'
}
module.exports.CHAIN_ID=CHAIN_ID;

const NETWORK = {
  MainNet: 0,
  TestNet: 1,
  RegTest: 2
}

module.exports.NETWORK;

const WQTUM = [
  {
    chainId: NETWORK.MainNet,
    address: 'e7e5caae57b34b93c57af9478a5130f62e3d2827'
  },
  {
    chainId: NETWORK.TestNet,
    address: 'f17277ffd027e75ec3f9e6db0e6fd1fd395e2cc0'
  }
]
module.exports.WQTUM = WQTUM;

const ROUTER = {
  [NETWORK.MainNet]: 'd4915308a9c4c40f57b0eccc63ee70616982842b',
  [NETWORK.TestNet]: '115931c3529e469d9240b90eb2f4965a61b1375e'
}
module.exports.ROUTER = ROUTER;

const FACTORY = {
  [NETWORK.MainNet]: '284937a9f5a1d28268d4e48d5eda03b04a7a1786',
  [NETWORK.TestNet]: '086edcf3fc8a042c1b174e941187369d2919e06b'
}
module.exports.FACTORY = FACTORY;