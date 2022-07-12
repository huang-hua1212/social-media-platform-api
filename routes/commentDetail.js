var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const postModel = require('../models/post');
const commentDetailModel = require('../models/commentDetail');
const dotenv = require('dotenv');
const addNewCommentDetail = require('../middleware/addNewCommentDetail');
dotenv.config({ path: './.env' });



// 留 留言
router.post('/:id', addNewCommentDetail, async (req, res) => {
    try {
        const id = req.params.id;
        const post = await postModel.findOne({ _id: id });
        post.commentDetail.push(req.commentDetailId);
        post.save();
        res.status(200).json({
            status: 'success',
            data: post,
        });
    } catch {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
    }
})


// 刪除留言
router.patch('/:id', async (req, res) => {

    try {
        const postId = req.params.id;
        const commentDetailId = req.body._id;
        const commentDetailObjectId = mongoose.Types.ObjectId(commentDetailId);
        const post = await postModel.findOne({ _id: postId });
        post.commentDetail = await post.commentDetail.filter(comment => comment.equals(commentDetailObjectId));
        await post.save();
        commentDetailModel.findByIdAndDelete(commentDetailId).then(() => {
            res.status(200).json({
                status: 'success',
                message: "刪除成功",
                data: post,
            });
        }).catch(err=>{
            console.log(err);
        })
    } catch {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
    }
})



module.exports = router;