const express = require('express');
const pairsRouter = express.Router();
var pairsController = require('../controllers/pairsController');

pairsRouter.use(express.json());

pairsRouter.get('/', pairsController.pairList);
pairsRouter.get('/:pair', pairsController.pairDetail);

module.exports = pairsRouter;