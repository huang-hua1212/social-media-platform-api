var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
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
        // console.log(res);
    })
    .catch((err) => {
        // console.log(err.reason);
    });

const postSchema = new mongoose.Schema(
    {
        name: String,
        tags: [String],
        type: String,
        image: String,
        content: String,
        likes: Number,
        comments: Number,
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

const dataModel = mongoose.model('Post', postSchema);

//get all
router.get('/posts', (req, res) => {
    // 測試1
    // dataModel.find().exec((err, datas)=>{
    //     res.json(datas);
    // });

    // 測試2
    dataModel.find().limit(50).exec(function (err, datas) {
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
    dataModel.findById(id).exec(function (err, datas) {
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
    var resObj = {};

    keys_1.forEach((value) => {
        if (properties.indexOf(value) === -1) {
            res.status(200).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
        }
        resObj[value] = obj[value];
    })

    dataModel.create(resObj)
        .then((data) => {
            res.status(200).json({
                status: "success",
                data,
            });
        })
        .catch((err) => {
            res.status(200).json({
                status: 'false',
                data: '新增失敗',
            })
        });
});

// patch
router.patch('/posts/:id', (req, res) => {
    const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
    const obj = req.body;
    const keys_1 = Object.keys(obj);
    var resObj = {};
    const id = req.params.id;
    keys_1.forEach((value) => {
        if (properties.indexOf(value) === -1) {
            res.status(200).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
        }
        resObj[value] = obj[value];
    })
    dataModel.findByIdAndUpdate(id, resObj)
        .then(() => {
            res.status(200).json({
                status: 'success',
                data: '更新成功',
            })
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
    dataModel.deleteMany({}, () => {
        res.status(200).json({
            status: 'success',
            data: '刪除成功',
        })
    });
})

// delete id
router.delete('/posts/:id', (req, res) => {
    const id = req.params.id;
    dataModel.findByIdAndDelete(id)
        .then(() => {
            res.status(200).json({
                status: 'success',
                data: '刪除成功',
            })
        })
        .catch(() => {
            res.status(200).json({
                status: 'false',
                data: '刪除失敗或無此ID',
            })
        });
})


module.exports = router