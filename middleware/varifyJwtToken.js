const userModel = require('../models/user.js');
const jwt = require('jsonwebtoken');
// 驗證JWT TOKEN
// MONGODB找token id，和token，確認是否存在
module.exports = async (req, res, next) => {
  try {
    // 從來自客戶端請求的 header 取得和擷取 JWT
    const token = req.header('Authorization').replace('Bearer ', '') // 去掉Bearer字串
    // 驗證 Token
    const decoded = await jwt.verify(token, process.env.SECRET)
    const user = await userModel.findOne({ _id: decoded._id})
   console.log('date.noew():', new Date(Date.now()));
    // 將 token 存到 req.token 上供後續使用
    req.token = token
    // 將用戶完整資料存到 req.user 上供後續使用
    req.user = user
    // 回傳userId
    req.userId = decoded._id;
    next()
  } catch (err) {
    switch (err.name) {
      // JWT 過期
      case 'TokenExpiredError':
        res.status(401).send({ error: 'invalid_grant', error_description: 'token 過期！' });
        // res.customError = { error: 'invalid_grant', error_description: 'token 過期！' };
        break;
      // JWT 無效
      case 'JsonWebTokenError':
        res.status(401).send({ error: 'invalid_grant', error_description: 'token 無效！' });
        // res.customError = { error: 'invalid_grant', error_description: 'token 無效！' };
        break;
    }
    // res.status(401).send({ error: 'Please authenticate.' })
  }
}