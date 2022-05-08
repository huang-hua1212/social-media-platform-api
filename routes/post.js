var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const postModel = require('../models/post');
// const userModel = require('../models/user');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
// Temp
const refreshToken = require('../middleware/file/imgur/refreshToken');
const uploadImg = require('../middleware/file/imgur/upload');
var multer = require('multer');
var uploadMulter = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png") {
            cb(null, true)
            return
        } else {
            cb(null, false)
            return cb(new Error('Allowed only .png'))
        }
    }
})



// 連結
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
    .then((res) => {
    })
    .catch((err) => {
    });



//get all
router.get('/posts', async (req, res) => {
    // 找到關聯user資料 populate
    // const user = await postModel.find().populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    // console.log(user);

    // 測試1
    // dataModel.find().exec((err, datas)=>{
    //     res.json(datas);
    // });

    // 測試2
    // postModel.find().limit(50).exec(function (err, datas) {
    //     // console.log(docs);
    //     res.status(200).json({
    //         status: 'success',
    //         datas,
    //     });
    // });


    //測試3
    postModel.find().limit(50).populate({
        path: 'user',
        select: 'name photo'
    }).exec(function (err, datas) {
        // console.log(docs);
        res.status(200).json({
            status: 'success',
            datas,
        });
    });
});





// get id
router.get('/posts/:id', (req, res) => {

    const id = req.params.id;
    // 測試1
    // postModel.findById(id).exec(function (err, datas) {
    //     // console.log(docs);
    //     if (!datas) {
    //         res.status(200).json({
    //             status: 'success',
    //             datas,
    //         });
    //     } else {
    //         res.status(401).json({
    //             status: 'false',
    //             message: "欄位未填寫正確，或無此 todo ID",
    //         });
    //     }

    // });

    // 測試2
    postModel.findById(id).populate({
        path: 'user',
        select: 'name photo'
    }).exec(function (err, datas) {
        // console.log(datas);
        if (datas) {
            res.status(200).json({
                status: 'success',
                datas,
            });
        } else {
            res.status(401).json({
                status: 'false',
                message: "欄位未填寫正確，或無此 todo ID",
            });
        }
    });
});

// post_1 no Image Process
router.post('/posts_1', (req, res) => {
    // const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
    const properties = ['name', 'tags', 'type', 'image', 'content'];
    const obj = req.body;
    const keys_1 = Object.keys(obj);
    var resObj = obj;
    postModel.create(resObj)
        .then((data) => {
            resObj = {};
            var fail = 0;
            keys_1.forEach((value) => {
                if (properties.indexOf(value) === -1) {
                    fail += 1;
                }
                resObj[value] = obj[value];
            })
            if (fail > 0) {
                res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
            } else {
                res.status(200).json({
                    status: "success",
                    data,
                });
            }
        })
        .catch(() => {
            res.status(200).json({
                status: 'false',
                data: '新增失敗',
            })
        });
});

// post_2 with Image Imgur Process
router.post('/posts', uploadMulter.single('image'), refreshToken, uploadImg, (req, res) => {
    // console.log(req.body);
    // const properties = ['name', 'tags', 'type', 'image', 'content'];
    const properties = ['user', 'tags', 'type', 'image', 'content'];
    const obj = req.body;
    const keys_1 = Object.keys(obj);
    obj.image = req.imgFile.link;
    var resObj = obj;
    postModel.create(resObj)
        .then((data) => {
            resObj = {};
            var fail = 0;
            keys_1.forEach((value) => {
                if (properties.indexOf(value) === -1) {
                    fail += 1;
                }
                resObj[value] = obj[value];
            })
            if (fail > 0) {
                res.status(400).json({ status: 'false', message: "欄位未填寫正確" });
            } else {
                res.status(200).json({
                    status: "success",
                    data,
                });
            }
        })
        .catch(() => {
            res.status(200).json({
                status: 'false',
                message: '新增失敗',
            })
        });
});




// patch
router.patch('/posts/:id', (req, res) => {
    const obj = req.body;
    const keys_1 = Object.keys(obj);
    // const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
    const properties = ['user', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
    var resObj = {};
    const id = req.params.id;
    postModel.findByIdAndUpdate(id, resObj)
        .then((result) => {
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
                res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });

            } else {
                res.status(200).json({
                    status: 'success',
                    data: '更新成功',
                })
            }
        })
        .catch(() => {
            res.status(400).json({
                status: 'false',
                data: '更新失敗或無此ID',
            })
        });
})

// delete all
router.delete('/posts', (req, res) => {
    postModel.deleteMany({}, () => {
        res.status(200).json({
            status: 'success',
            data: '刪除成功',
        })
    });
})

// delete id
router.delete('/posts/:id', (req, res) => {
    const id = req.params.id;
    postModel.findByIdAndDelete(id)
        .then((result) => {
            if (!result) {
                throw new Error(false);
            } else {
                res.status(200).json({
                    status: 'success',
                    data: '刪除成功',
                })
            }
        })
        .catch(() => {
            res.status(200).json({
                status: 'false',
                data: '刪除失敗或無此ID',
            })
        });
})



// // 網址輸入錯誤處理
// router.use((req, res, next) => {
//     // 404:網址錯誤
//     res.status(404).json({
//         status: 'false',
//         data: '網址輸入錯誤'
//     })
// })


// // 程式錯誤處理
// router.use((req, res, next) => {
//     // 500:程式錯誤
//     res.status(500).json({
//         status: 'false',
//         data: '程式發生問題，請稍後嘗試'
//     })
// })




module.exports = router