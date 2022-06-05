var createError = require('http-errors');
const dotenv = require('dotenv');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// session store
const MongoStore = require('connect-mongo')(session); // 此session為上面一行的session變數
// ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/post');
var userVerifyRouter = require('./routes/userJwt');
var oauthLoginRouter = require('./routes/userOauth2');
var uploadImgRouter = require('./routes/uploadImg');
var redisTestRouter = require('./routes/redisTest');
// var followingRouter = require('./routes/following');
var userFollowingRouter = require('./routes/userFollowing');
var postLikesRouter = require('./routes/postLikes');
var commentDetailRouter = require('./routes/commentDetail');
var errorRouter = require('./routes/week5_HW');
var fileCloudRouter = require('./routes/fileCloudStorage');
var sessionLoginRouter = require('./routes/sessionLogin');

var cors = require('cors');
// swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json') // 剛剛輸出的 JSON
dotenv.config({ path: './.env' });

// mongodb connection
require('./connections/mongodb');

// 有沒有寫錯程式碼
//　記錄錯誤，等到服務都處理完後，停掉該ｐｒｏｃｅｓｓ
process.on('uncaughException', err => {
  console.error('Uncaughted Exception!!');
  console.error(err);
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
})



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
app.use('/users', usersRouter);
app.use('/posts', postRouter);
app.use('/', userVerifyRouter);
app.use('/', oauthLoginRouter);
app.use('/', uploadImgRouter);
// app.use('/', followingRouter);
app.use('/', userFollowingRouter);
app.use('/', postLikesRouter);
app.use('/', commentDetailRouter);
app.use('/', errorRouter);
app.use('/fileCloudStorage', fileCloudRouter);
app.use('/redisTest', redisTestRouter);
//設置session相關設定
app.use(session({
  secret: 'thisismynewproject',
  store:new MongoStore({url:'mongodb+srv://dbUser:wendy8645@cluster0.ks5pg.mongodb.net/hotel?authSource=admin&replicaSet=atlas-pfbouq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'}),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 20* 1000 } //10分鐘到期

}));
// app.use(session({
//   secret: 'thisismynewproject',
//   store: MongoStore.create({
//     mongoUrl: 'mongodb://cluster0.ks5pg.mongodb.net:27017/hotel'
//   }),
//   resave: false,
//   saveUninitialized: true,
//   cookie: { maxAge: 600 * 1000 } //10分鐘到期

// }));
// Session Login
app.use('/session-login', sessionLoginRouter);


// swagger
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


// 404錯誤
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: '無此路由資訊',
  });
});

const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
      // error: err,
      // stack: err.stack,
    })
  } else {
    // 送出罐頭預設訊息
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請恰系統管理員'
    });
  }
}

// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  })
}


app.use((err, req, res, next) => {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }

  //production
  if (err.name === 'ValidationError') {
    err.message = "資料欄位未填寫正確，請重新輸入!"
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res);
})



// 'uncaughException'跑來這裡，
// 500 error handler
app.use(function (err, req, res, next) {
  // 自訂500錯誤
  res.status(500).json({
    "err": err.message,
  })
});





// 未捕捉到的 catch
process.on('unhandledRejection', (error, promise) => {
  console.log('未捕捉到的 rejection：', promise, '原因：', error);
})







// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
//   //     自訂404錯誤
//   //     next(res.status(404).json({
//   //         status: 'false',
//   //         data: '網址輸入錯誤'
//   //     }))
// });



// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // catch 500 and forward to error handler
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
//   // 自訂500錯誤
//   // res.status(500).json({
//   //         status: 'false',
//   //         data: '程式發生問題，請稍後嘗試'
//   //     })
// });

module.exports = app;
