var express = require("express");
var mongoose = require("mongoose");
const userModel = require('../models/user.js');
const auth = require('../middleware/varifyJwtToken');
const login = require('../middleware/login');
var router = express.Router();

const DB = process.env.DATABASE
    .replace(
        '<username>',
        process.env.DATABASE_USERNAME
    )
    .replace(
        '<password>',
        process.env.DATABASE_PASSWORD
    )
mongoose.connect(DB)
    .then(() => {
    })
    .catch(() => {
    });







// 註冊路由: 1.新增帳號密碼=>加密密碼 2.新增token
router.post('/userOauth/register', async (req, res) => {
    try {
        // 從 req.body 獲取驗證資訊，並在資料庫存與該用戶
        const user = await userModel.create(req.body);
        
        // const token = await user.generateAuthToken();
        const [token, expiresIn] = await user.generateAuthToken();
        res.status(201).send({
            status: 'success',
            user
        })
    } catch (err) {
        res.status(400).send({
            status: 'false',
            err
        })
    }
})



// 登入路由
router.post('/userOauth/login', async (req, res) => {
    try {
        // 驗證使用者，並將驗證成功回傳的用戶完整資訊存在 user 上
        const user = await userModel.findByCredentials(req.body.username, req.body.password);
        // 為該成功登入之用戶產生 JWT
        // const token = await user.generateAuthToken()
        const [token, expiresIn] = await user.generateAuthToken();
        // 回傳該用戶資訊及 JWT
        res.status(201).send({
            status: 'success',
            user,
        })
    } catch (err) {
        res.status(400).send({
            status: 'false',
            error: err.message
        })
    }
})


// oauth登入 = login(findByCredentials+generateAuthToken) + auth(驗證jwt token)
router.post('/userOauth/logout', auth, async (req, res) => {
    try {
        // 篩選掉當前的 Token 
        req.user.tokens = await req.user.tokens.filter(token => token.token !== req.token)
        // 將包含剩餘 Token 的使用者資料存回資料庫
        await req.user.save()
        res.status(200).send({
            status: 'success',
            message: 'log out',
        })
    } catch (err) {
        res.status(500).send()
    }
})


// oauth登入 = login(findByCredentials+generateAuthToken) + auth(驗證jwt token)
router.post('/userOauth/login-auth', login, auth, async (req, res) => {
    
    res.status(200).send({
        status: 'success',
        message: '登入成功',
    })
})



module.exports = router;