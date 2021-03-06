// 參考https://www.footmark.com.tw/news/programming-language/nodejs/nodejs-restful-webapi-oauth2-jwt/#fm-chapter-3
var jwt = require('jsonwebtoken');  // JWT 簽名和驗證
var conf = require('../conf');
const userModel = require('../models/user.js');
const jwt = require('jsonwebtoken');

function login(req) {
    // 驗證 OAuth 2.0 授權類型
    if (!req.body.grant_type || req.body.grant_type != 'password') {
        res.status(400).json({ error: 'unsupported_grant_type', error_description: '授權類型無法識別，本伺服器僅支持 Password 類型！' });
        return;
    }
    // 驗證使用者，並將驗證成功回傳的用戶完整資訊存在 user 上
    const user = await userModel.findByCredentials(req.body.username, req.body.password);

    
}

module.exports = {
    // 使用者登入認證
    // mongodb
    login: function (req) {
        // 驗證 OAuth 2.0 授權類型
        try {
            // 驗證 OAuth 2.0 授權類型
            if (!req.body.grant_type || req.body.grant_type != 'password') {
                res.status(400).json({ error: 'unsupported_grant_type', error_description: '授權類型無法識別，本伺服器僅支持 Password 類型！' });
                return;
            }
            // 驗證使用者，並將驗證成功回傳的用戶完整資訊存在 user 上
            const user = await userModel.findByCredentials(req.body.username, req.body.password);
            // // 為該成功登入之用戶產生 JWT
            // const token = await user.generateAuthToken()
            // // 回傳該用戶資訊及 JWT
            // res.status(201).send({
            //     status: 'success',
            //     user,
            // })
        } catch {
            res.status(400).send({
                status: 'false',
                error: err.message
            })
        }
    },
    // 產生 OAuth 2.0 和 JWT 的 JSON 格式令牌訊息
    // mongodb
    createToken: function (mongoResult, req, res, callback) {
        let payload = {
            iss: mongoResult.username,
            sub: 'HR System Web API',
            role: mongoResult.role   // 自訂聲明。用來讓伺服器確認使用者的角色權限 (決定使用者能使用 Web API 的權限)
        };

        const EXPIRES_IN = 5*60 * 1000; // 5 min
        // 產生 JWT
        let token = jwt.sign(payload, process.env.SECRET, {
            // algorithm: 'HS256',
            // expiresIn: '1 day'  // JWT 的到期時間 (當前 UNIX 時間戳 + 設定的時間)。必須加上時間單位，否則預設為 ms (毫秒)
            expiresIn: 10,
        })

        // 確保客戶端瀏覽器不緩存此請求 (OAuth 2.0 標準)
        res.header('Cache-Control', 'no-store');
        res.header('Pragma', 'no-cache');

        // JSON 格式符合 OAuth 2.0 標準，除自訂 info 屬性是為了讓前端取得額外資訊 (例如使用者名稱)，
        return callback({
            access_token: token,
            token_type: 'bearer',
            expires_in: 10,    // UNIX 時間戳 + conf.increaseTime
            scope: mongoResult.role,
            info: {
                username: mongoResult.username
            }
        });
    },
    // 驗證 JWT
    tokenVerify: function (req, res, next) {
        // 沒有 JWT
        if (!req.headers.authorization) {
            res.customStatus = 401;
            res.customError = { error: 'invalid_client', error_description: '沒有 token！' };
        }

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer') {
            jwt.verify(req.headers.authorization.split(' ')[1], conf.secret, function (err, decoded) {
                if (err) {
                    res.customStatus = 400;

                    switch (err.name) {
                        // JWT 過期
                        case 'TokenExpiredError':
                            res.customError = { error: 'invalid_grant', error_description: 'token 過期！' };
                            break;
                        // JWT 無效
                        case 'JsonWebTokenError':
                            res.customError = { error: 'invalid_grant', error_description: 'token 無效！' };
                            break;
                    }
                } else {
                    req.user = decoded;
                }
            });
        }

        next();
    },
    // Web API 存取控制
    accessControl: function (req, res, next) {
        console.log(req.user);

        // 如不是 admin，則無權限
        switch (req.user.role) {
            case null:
            case 'user':
            case 'guest':
                res.customStatus = 400;
                res.customError = { error: 'unauthorized_client', error_description: '無權限！' };
                break;
        }

        next();
    }
};