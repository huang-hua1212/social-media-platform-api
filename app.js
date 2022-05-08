var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/post');
var userVerifyRouter = require('./routes/userJwt');
var oauthLoginRouter = require('./routes/userOauth2');
var uploadImgRouter = require('./routes/uploadImg');

var cors = require('cors');

// swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json') // 剛剛輸出的 JSON


var app = express();

// Cross-Origin Resource Sharing 
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', postRouter);
app.use('/', userVerifyRouter);
app.use('/', oauthLoginRouter);
app.use('/', uploadImgRouter);




// swagger
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
  //     自訂404錯誤
  //     next(res.status(404).json({
  //         status: 'false',
  //         data: '網址輸入錯誤'
  //     }))
});





// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // catch 500 and forward to error handler
  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // 自訂500錯誤
  // res.status(500).json({
  //         status: 'false',
  //         data: '程式發生問題，請稍後嘗試'
  //     })
});

module.exports = app;
