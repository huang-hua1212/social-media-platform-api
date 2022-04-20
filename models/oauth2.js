var mysql = require('mysql');

var jwt = require('jsonwebtoken');  // JWT 簽名和驗證
var conf = require('../conf');
const userModel = require('../models/user.js');

var connection = mysql.createConnection(conf.db);
var tableName = 'accounts';
var sql;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, '帳號尚未填寫']
        },
        password: {
            type: String,
            required: [true, '密碼尚未填寫']
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        role: {
            type: String,
            default: 'user',
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // .find() 時不會顯示，像是隱藏欄位{_id: false}
            select: false,
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

module.exports = {
    // 使用者登入認證
    // mysql
    // login: function (req, callback) {
    //     sql = mysql.format('SELECT * FROM ' + tableName + ' WHERE username = ? AND password = ?', [req.body.username, req.body.password]);
    //     return connection.query(sql, callback);
    // },
    // mongodb
    login: function (req, callback) {
        try {
            // 驗證使用者，並將驗證成功回傳的用戶完整資訊存在 user 上
            const user = await userModel.findByCredentials(req.body.username, req.body.password);
            // 為該成功登入之用戶產生 JWT
            const token = await user.generateAuthToken()
            // 回傳該用戶資訊及 JWT
            res.status(201).send({
                status: 'success',
                user,
            })
        } catch {
            res.status(400).send({
                status: 'false',
                error: err.message
            })
        }
        // return connection.query(sql, callback);
    },
    // 產生 OAuth 2.0 和 JWT 的 JSON 格式令牌訊息
    // mysql
    // createToken: function (req, callback) {
    //     let payload = {
    //         iss: req.results[0].username,
    //         sub: 'HR System Web API',
    //         role: req.results[0].role   // 自訂聲明。用來讓伺服器確認使用者的角色權限 (決定使用者能使用 Web API 的權限)
    //     };

    //     // 產生 JWT
    //     let token = jwt.sign(payload, conf.secret, {
    //         algorithm: 'HS256',
    //         expiresIn: '1 day'  // JWT 的到期時間 (當前 UNIX 時間戳 + 設定的時間)。必須加上時間單位，否則預設為 ms (毫秒)
    //     })

    //     // JSON 格式符合 OAuth 2.0 標準，除自訂 info 屬性是為了讓前端取得額外資訊 (例如使用者名稱)，
    //     return callback({
    //         access_token: token,
    //         token_type: 'bearer',
    //         expires_in: (Date.parse(new Date()) / 1000) + conf.increaseTime,    // UNIX 時間戳 + conf.increaseTime
    //         scope: req.results[0].role,
    //         info: {
    //             username: req.results[0].username
    //         }
    //     });
    // },
    // mongodb
    createToken: function (req, callback) {
        let payload = {
            iss: req.results[0].username,
            sub: 'HR System Web API',
            // role: req.results[0].role   // 自訂聲明。用來讓伺服器確認使用者的角色權限 (決定使用者能使用 Web API 的權限)
        };

        // 產生 JWT
        let token = jwt.sign(payload, process.env.SECRET, {
            // algorithm: 'HS256',
            expiresIn: '1 day'  // JWT 的到期時間 (當前 UNIX 時間戳 + 設定的時間)。必須加上時間單位，否則預設為 ms (毫秒)
        })

        // JSON 格式符合 OAuth 2.0 標準，除自訂 info 屬性是為了讓前端取得額外資訊 (例如使用者名稱)，
        return callback({
            access_token: token,
            token_type: 'bearer',
            expires_in: (Date.parse(new Date()) / 1000) + conf.increaseTime,    // UNIX 時間戳 + conf.increaseTime
            scope: req.results[0].role,
            info: {
                username: req.results[0].username
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