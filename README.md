# QiSWAP API

## Live deployment

http://testnet-graph.qiswap.com/


## Rest endpoints deployed

|  End Point | Description   |
|---|---|
| /pairs  | List pairs deployed on Qiswap  |
| /pairs/:pair   | Returns available data for a specific pair, i.e. *pairs/QI_WQTUM*  |

## Overview

### a. Folder structure

```javascript
docker // docker-compose file  
graphql-api  // API graphql backend implementation
homepage  // hugo.io app and static files for homepage
nginx  // nginx reverse proxy server
rest-api  // API rest backend implementation
utils // QiSWAP ABIs, conntants and config files
```

### b. Architecture

![architecture](./utils/docs/qiswap-api-diagram.png)

### c. Screenshots

URL: http://testnet-graph.qiswap.com/

![home](./utils/docs/home.png)

URL: http://testnet-graph.qiswap.com/graphql-api/v1/

![graphql](./utils/docs/grapghql-api.png)

URL: http://testnet-graph.qiswap.com/rest-api/v1/

![restful](./utils/docs/rest-api.png)


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

## Miscelaneous

### 1. Updates to homepage static files

Homepage static files are handled via gohugo.io

To update the homepage:
```bash
cd homepage
hugo -D
```
### 2. SSL cert renewal

SSL certificates are renewed automatically via a `cronjob` that executes the script `./docker/ssl_renew.sh` every day at noon

```bash

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/testnet-graph.qiswap.com.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Certificate not due for renewal, but simulating renewal for dry run
Non-interactive renewal: random delay of 259.43743094994437 seconds
Plugins selected: Authenticator webroot, Installer None
Simulating renewal of an existing certificate for testnet-graph.qiswap.com
Performing the following challenges:
http-01 challenge for testnet-graph.qiswap.com
Using the webroot path /var/www/certbot for all unmatched domains.
Waiting for verification...
Cleaning up challenges

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/testnet-graph.qiswap.com/fullchain.pem (success)

```