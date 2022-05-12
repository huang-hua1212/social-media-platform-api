var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const postModel = require('../models/post');
const followingModel = require('../models/following');
const userModel = require('../models/user');
const dotenv = require('dotenv');
const addNewFollowing = require('../middleware/addNewFollowing');
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



// :id為使用者
router.post('/userFollowing/:id', addNewFollowing, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findOne({ _id: id });
        user.followings.push(req.followingsUserId);
        user.save();
        res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (err) {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });

    }
})


// :id為userId, userFollowing collection的_id
router.patch('/userFollowing/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const followingId = req.body._id;
        const user = await userModel.findOne({ _id: userId });
        user.followings = await user.followings.filter(following => following !== followingId);
        console.log(user.followings);
        await user.save();
        // const following = await followingModel.findOne({ _id: followingId });
        followingModel.findByIdAndDelete(followingId).then((data) => {
            res.status(200).json({
                status: 'success',
                message: "刪除成功",
                data: user,
            });
        }).catch(() => {
            res.status(400).json({ status: 'false', message: "欄位未填寫正確" });
        });
        // user.save();
        // res.status(200).json({
        //     status: 'success',
        //     message: "刪除成功",
        //     data: user,
        // });
    } catch {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確" });
    }
})





module.exports = router;

