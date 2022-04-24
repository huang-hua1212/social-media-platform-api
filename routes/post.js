var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const postModel = require('../models/post');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

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
router.get('/posts', (req, res) => {
    // 測試1
    // dataModel.find().exec((err, datas)=>{
    //     res.json(datas);
    // });

    // 測試2
    postModel.find().limit(50).exec(function (err, datas) {
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
    postModel.findById(id).exec(function (err, datas) {
        // console.log(docs);
        res.status(200).json({
            status: 'success',
            datas,
        });
    });
});

// post
router.post('/posts', (req, res) => {
    const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
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

// patch
router.patch('/posts/:id', (req, res) => {
    const obj = req.body;
    const keys_1 = Object.keys(obj);
    const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
    var resObj = {};
    const id = req.params.id;
    postModel.findByIdAndUpdate(id, resObj)
        .then((result) => {
            var fail = 0;
            if(!result){
                throw new Error(false);
            }
            keys_1.forEach((value) => {
                if (properties.indexOf(value) === -1) {
                    fail += 1;
                }
                resObj[value] = obj[value];
            })
            if (fail > 0 ) {
                res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });

            } else {
                res.status(200).json({
                    status: 'success',
                    data: '更新成功',
                })
            }
        })
        .catch(() => {
            res.status(200).json({
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


module.exports = router