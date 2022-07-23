const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // 此session為上面一行的session變數
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postRouter = require('./routes/post');
const userVerifyRouter = require('./routes/userJwt');
const oauthLoginRouter = require('./routes/userOauth2');
const uploadImgRouter = require('./routes/uploadImg');
const redisTestRouter = require('./routes/redisTest');
const userFollowingRouter = require('./routes/userFollowing');
const postLikesRouter = require('./routes/postLikes');
const commentDetailRouter = require('./routes/commentDetail');
const errorRouter = require('./routes/week5_HW');
const fileCloudOneDriveRouter = require('./routes/fileCloudOneDriveStorage');
const sessionLoginRouter = require('./routes/sessionLogin');
const loginAuthenticatorRouter = require('./routes/loginAuthenticator');
const shoppingCartRouter = require('./routes/react_tutorial_shopping_cart');
const ssr  = require('./services/ssr.js');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json'); // 剛剛輸出的 JSON
require('./connections/mongodb');
// const { Console } = require('console');
dotenv.config({ path: './.env' });

process.on('uncaughException', err => {
  console.error('Uncaughted Exception!!');
  console.error(err);
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
})

var app = express();
app.use(cors());
// app.use(cors({
//   credentials: true,
//   origin: ['http://localhost:8080', 'http://localhost:8082'] 
// }));

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
app.use('/user', userVerifyRouter);
app.use('/userOauth', oauthLoginRouter);
app.use('/uploadImg', uploadImgRouter);
// app.use('/', followingRouter);
app.use('/userFollowing', userFollowingRouter);
app.use('/postLikes', postLikesRouter);
app.use('/postAddComment', commentDetailRouter);
app.use('/error', errorRouter);
app.use('/fileCloudStorage', fileCloudOneDriveRouter);
app.use('/redisTest', redisTestRouter);
//設置session相關設定
app.use(session({
  secret: 'thisismynewproject',
  store: new MongoStore({ url: 'mongodb+srv://dbUser:wendy8645@cluster0.ks5pg.mongodb.net/hotel?authSource=admin&replicaSet=atlas-pfbouq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true' }),
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 20 * 1000, //10分鐘到期
  } 
}));
app.use('/session-login', sessionLoginRouter);
app.use('/login-twofactor-authenticator', loginAuthenticatorRouter);
app.use('/react-shopping-cart', shoppingCartRouter);
// ssr 服務器渲染-方法一
app.get('/ssrweb-way1', function(req, res, next) {
  res.render('ssrweb');
});
// ssr 服務器渲染-方法二
app.get('/ssrewb-way2', async (req, res, next) => {
  const {html, ttRenderMs} = await ssr(`${req.protocol}://${req.get('host')}/ssrweb`);
  // Add Server-Timing!
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
  return res.status(200).send(html); // Serve prerendered page as response.
});
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

app.use(function (err, req, res, next) {
  // 自訂500錯誤
  res.status(500).json({
    "err": err.message,
  })
});

process.on('unhandledRejection', (error, promise) => {
  console.log('未捕捉到的 rejection：', promise, '原因：', error);
})


module.exports = app;
