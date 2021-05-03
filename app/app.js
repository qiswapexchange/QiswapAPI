var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var tickerRouter = require('./routes/tickers');
var pairsRouter = require('./routes/pairs');
var historicalRouter = require('./routes/historical');

///////////Testing////////////
var uniswapTickerRouter = require('./routes/uniswap/uniswapTickers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/qiswap/api/*', (req, res, next) => {
  res.statusCode = 403;
  res.end('QiSwap: POST operation not supported on /api/');
})
app.put('/qiswap/api/*', (req, res, next) => {
  res.statusCode = 403;
  res.end('QiSwap: PUT operation not supported on /api/');
})
app.delete('/qiswap/api/*', (req, res, next) => {
  res.statusCode = 403;
  res.end('QiSwap: DELETE operation not supported on /api/');
})
app.get('/qiswap/api/v1/*/*/*', (req, res, next) => {
  res.statusCode = 403;
  res.end('QiSwap: operation not supported');
})

app.use('/qiswap/api/v1/', indexRouter);
app.use('/qiswap/api/v1/tickers', tickerRouter);
app.use('/qiswap/api/v1/pairs/', pairsRouter);
app.use('/qiswap/api/v1/historical', historicalRouter);
app.use('/qiswap/api/v1/uniswap/', uniswapTickerRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
