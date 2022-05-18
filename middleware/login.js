const userModel = require('../models/user.js');

module.exports = async (req, res, next) => {
    try {
        // oauth2.0限定，要在json中加上grant_type
        if (!req.body.grant_type || req.body.grant_type != 'password') {
            res.status(400).json({ error: 'unsupported_grant_type', error_description: '授權類型無法識別，本伺服器僅支持 Password 類型！' });
            return;
        }
        // 驗證使用者，並將驗證成功回傳的用戶完整資訊存在 user 上
        const user = await userModel.findByCredentials(req.body.username, req.body.password);
        // 為該成功登入之用戶產生 JWT
        // const token = await user.generateAuthToken()
        const [token, expiresIn] = await user.generateAuthToken();
        // 加個next會跑到之後的function (express框架限定)
        next()
    } catch {
        res.status(400).send({
            status: 'error',
            message: '登入失敗',
        })
    }
}