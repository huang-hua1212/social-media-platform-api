const userModel = require('../models/user.js');
const jwt = require('jsonwebtoken');
// 驗證JWT TOKEN
// MONGODB找token id，和token，確認是否存在
module.exports = async (req, res, next) => {
  try {
    console.log(req.header('Authorization'));
    // 從來自客戶端請求的 header 取得和擷取 JWT
    const token = req.header('Authorization').replace('Bearer ', '') // 去掉Bearer字串
    // 驗證 Token
    const decoded = jwt.verify(token, process.env.SECRET)
    // 找尋符合用戶 id 和 Tokens 中包含此 Token 的使用者資料
    const user = await userModel.findOne({ _id: decoded._id, 'tokens.token': token })
    // 若沒找到此用戶，丟出錯誤
    if (!user) { throw new Error() }
    // 將 token 存到 req.token 上供後續使用
    req.token = token
    // 將用戶完整資料存到 req.user 上供後續使用
    req.user = user
    next()
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' })
  }
}