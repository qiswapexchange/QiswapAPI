var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'QiSwap API REST', url: 'qiswap/api/v1' });
});

module.exports = router;
