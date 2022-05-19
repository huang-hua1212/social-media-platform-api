var multer = require('multer');
const postModel = require('../models/post');

const posts = {
    getAll: async (req, res) => {
        postModel.find().limit(50).populate({
            path: 'user',
            select: 'name photo'
        }).populate({
            path: 'commentDetail',
            select: 'user content likes whoLikes createdAt updatedAt',
            populate: {
                path: 'user',
                select: 'name photo'
            }
        }).exec(function (err, datas) {
            res.status(200).json({
                status: 'success',
                datas,
            });
        });
    },
    getPostByPostId: (req, res) => {
        const id = req.params.id;

        postModel.findById(id).populate({
            path: 'user',
            select: 'name photo'
        }).populate({
            path: 'commentDetail',
            select: 'user content likes whoLikes createdAt updatedAt',
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
    getPostByUserId: (req, res) => {
        const id = req.params.id;

        postModel.find({
            user: id
        }).populate({
            path: 'user',
            select: 'name photo'
        }).populate({
            path: 'commentDetail',
            select: 'user content likes whoLikes createdAt updatedAt',
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
    }
}


module.exports = posts;