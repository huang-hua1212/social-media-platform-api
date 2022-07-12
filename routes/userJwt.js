var express = require("express");
const userModel = require('../models/user.js');
const auth = require('../middleware/varifyJwtToken');
const login = require('../middleware/login');
const accessControl = require('../middleware/accessControl');

var router = express.Router();







// 註冊路由: 1.新增帳號密碼=>加密密碼 2.新增token
router.post('/register', async (req, res) => {
    try {
        // 從 req.body 獲取驗證資訊，並在資料庫存與該用戶
        const user = await userModel.create(req.body);
        const [token, expiredAt] = await user.generateAuthToken();
        // const token = await user.generateAuthToken();
        res.status(201).send({
            status: 'success',
            message: '註冊成功',
            // token,
            // token_expiresAt: expiredAt,
        })
    } catch (err) {
        res.status(400).send({
            status: 'false',
            err
        })
    }
})



// 登入路由
// 未加入accessControl
router.post('/login', async (req, res) => {
    try {
        // 驗證使用者，並將驗證成功回傳的用戶完整資訊存在 user 上
        const user = await userModel.findByCredentials(req.body.username, req.body.password);
        // 為該成功登入之用戶產生 JWT
        const [token, expiredAt] = await user.generateAuthToken();
        console.log(new Date(expiredAt));
        // console.log(expiredAt.format("dd/MM/yyyy HH:mm:ss sss"));
        // const token = await user.generateAuthToken();
        // 資料庫存所有tokens，但回傳給前端的只放一個使用者申請的token
        user.tokens = [] //[token];
        user.tokens.push({ token, expiredAt });
        // 回傳該用戶資訊及 JWT
        // res.status(200).send({
        //     status: 'success',
        //     user,
        // })
        res.status(200).send({
            status: 'success',
            token,
            token_expiresAt: expiredAt,
        })
    } catch (err) {
        res.status(400).send({
            status: 'false',
            error: err.message
        })
    }
})
// // 加入accessControl //用於要get post put patch delete資料時，要經過accessControl權限的認證後方可根據身分來取用資料
// router.post('/user/login',accessControl, async (req, res) => {
//     try {
//         // 驗證使用者，並將驗證成功回傳的用戶完整資訊存在 user 上
//         const user = await userModel.findByCredentials(req.body.username, req.body.password);
//         // console.log(user);
//         // 為該成功登入之用戶產生 JWT
//         const token = await user.generateAuthToken()
//         // 只放一個token
//         user.tokens = [] //[token];
//         user.tokens.push({ token });

//         // 回傳該用戶資訊及 JWT
//         res.status(201).send({
//             status: 'success',
//             user,
//         })
//     } catch (err) {
//         res.status(400).send({
//             status: 'false',
//             error: err.message
//         })
//     }
// })

//  登出
router.post('/logout', auth, async (req, res) => {
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
router.post('/auth-check', auth, async (req, res) => {
    res.status(200).send({
        status: 'success',
        token: req.token,
        userId: req.userId,
    })
})




// oauth登入 = login(findByCredentials+generateAuthToken) + auth(驗證jwt token)
router.post('/login-auth', login, auth, async (req, res) => {
    res.status(200).send({
        status: 'success',
        message: '登入成功',
    })
})
// // 登出路由
// app.post('/user/logout', async (req, res) => {
//     res.send()
// })

// // 登出所有裝置
// app.post('/user/logoutAll', auth, async (req, res) => {
//     res.send()
// })

// app.listen(port, () => {
//     console.log('app is listening')
// })

module.exports = router;