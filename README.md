# QiSWAP REST API

## Live deployment

http://15.236.123.126/qiswap/api/v1/


## Endpoints deployed

|  End Point | Description   |
|---|---|
| /pairs  | List pairs deployed on Qiswap  |
| /pairs/:pair   | Returns available data for a specific pair, i.e. *pairs/QI_WQTUM*  |


## Pre-requisites
Janus and Qtumd containers must be up and running on the same host where the API is deployed

## Usage

1. Clone the repository
2. Run script to update docker-compose file with localhost ip address to access Janus

```bash
cd docker
./setup.sh
```

3. Start QiSwap API containers


```bash
docker-compose --build up -d
``` 