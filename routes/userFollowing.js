var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const followingModel = require('../models/following');
const userModel = require('../models/user');
const dotenv = require('dotenv');
const addNewFollowing = require('../middleware/addNewFollowing');
dotenv.config({ path: './.env' });



    

// 追蹤
// :id為使用者
router.post('/:id', addNewFollowing, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findOne({ _id: id });
        user.followings.push(req.followingsUserId);
        user.save();
        res.status(200).json({
            status: 'success',
            data: req.followingsUserId,
        });
    } catch (err) {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });

    }
})


// 退追蹤
// :id為userId, userFollowing collection的_id
router.patch('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const followingId = req.body._id;
        const followingObjectId = mongoose.Types.ObjectId(followingId);
        const user = await userModel.findOne({ _id: userId });
        user.followings = await user.followings.filter( following => !following.equals(followingObjectId));
        await user.save();
        followingModel.findByIdAndDelete(followingId).then((data) => {
            res.status(200).json({
                status: 'success',
                message: "刪除成功",
                data: user,
            });
        }).catch((err) => {
            console.log(err);
            res.status(400).json({ status: 'false', message: "欄位未填寫正確" });
        });
    } catch {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確" });
    }
})





module.exports = router;

