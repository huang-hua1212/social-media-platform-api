var multer = require('multer');
const userModel = require('../models/user');
const appError = require('../services/appError');


const users = {
    getUserByUserId: async (req, res, next) => {
        const id = req.params.id;

        userModel.findById(id).populate({
            path: 'followings',
            select: '_id user whoFollow createdAt updateAt',
            populate: {
                path: 'user',
                select: 'name photo'
            }
        }).populate({
            path: 'likePosts',
            select: '_id user image content createdAt updateAt',
            populate: {
                path: 'user',
                select: 'name photo'
            }
        }).exec(function (err, datas) {
            if (datas) {
                res.status(200).json({
                    status: 'success',
                    datas,
                });
            } else {
                return next(appError(400, "欄位未填寫正確", next));
            }
        });
    },
    patchUserWithUrlImg: async (req, res, next) => {
        const obj = req.body;
        const keys_1 = Object.keys(obj);
        const properties = ['name', 'username', 'password', 'role', 'sex', 'photo', 'followings', 'tokens', 'likePosts'];
        var resObj = obj;
        const id = req.params.id;
        // // 加密
        if (resObj.password !== "" && resObj.password !== undefined) {
            resObj.password = await bcrypt.hash(resObj.password, 8)
        }
        userModel.findByIdAndUpdate(id, resObj)
            .then(async (result) => {
                var fail = 0;
                if (!result) {
                    throw new Error(false);
                }
                keys_1.forEach((value) => {

                    if (properties.indexOf(value) === -1) {
                        fail += 1;
                    }
                    resObj[value] = obj[value];
                })


                if (fail > 0) {
                    //   res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });
                    return next(appError(400, "欄位未填寫正確", next));
                } else {
                    res.status(200).json({
                        status: 'success',
                        data: '更新成功',
                    })
                }
            })
            .catch(() => {
                return next(appError(400, "欄位未填寫正確", next));
            });
    },
    patchUserWithFormDataImg: async (req, res, next) => {
        const obj = req.body;
        const keys_1 = Object.keys(obj);
        const properties = ['name', 'username', 'password', 'role', 'sex', 'photo', 'followings', 'tokens'];
        obj.photo = req.imgFile.link;
        var resObj = obj;
        const id = req.params.id;
        userModel.findByIdAndUpdate(id, resObj)
            .then((result) => {
                var fail = 0;
                if (!result) {
                    throw new Error(false);
                }
                keys_1.forEach((value) => {
                    console.log(value);
                    if (properties.indexOf(value) === -1) {
                        fail += 1;
                    }
                    resObj[value] = obj[value];
                })
                if (fail > 0) {
                    return next(appError(400, "欄位未填寫正確", next));

                } else {
                    res.status(200).json({
                        status: 'success',
                        data: '更新成功',
                    })
                }
            })
            .catch(() => {
                return next(appError(400, "欄位未填寫正確", next));
            });
    },
    sign_up: async (req, res, next) => {
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
            return next(appError(400, err, next));
        }
    },
    sign_in: async (req, res, next) =>{
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
            res.status(200).send({
                status: 'success',
                token,
                token_expiresAt: expiredAt,
            })
        } catch (err) {
            return next(appError(400, err.message, next));
        }
    }
}


module.exports = users;