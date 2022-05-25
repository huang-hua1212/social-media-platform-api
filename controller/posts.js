var multer = require('multer');
const mongoose = require('mongoose');
const postModel = require('../models/post');
const userModel = require('../models/user');
const commentDetailModel = require('../models/commentDetail');


const posts = {
    getAll: async (req, res, next) => {
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
    getPostByPostId: async (req, res, next) => {
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
    getPostByUserId: async (req, res, next) => {
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
    },
    postRegexContentSearchPostUnderPosId: async (req, res, next) => {
        const id = req.params.id;
        const obj = req.body;

        // 測試2
        postModel.find({
            user: id,
            content: {
                $regex: obj['content']
            }
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
    },
    postRegexContentSearchPost: async (req, res, next) => {
        const obj = req.body;
        if (obj['content'] === undefined) {
            return next(appError(400, "欄位未填寫正確", next));
            // res.status(401).json({
            //     status: 'false',
            //     message: "欄位未填寫正確",
            // });
        } else {
            postModel.find({
                content: {
                    $regex: obj['content']
                }
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
                res.status(200).json({
                    status: 'success',
                    datas,
                });
            });
        }
    },
    postFormDataAddNewPost: async (req, res, next) => {
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
                    // res.status(400).json({ status: 'false', message: "欄位未填寫正確" });
                    return next(appError(400, "欄位未填寫正確", next));
                } else {
                    res.status(200).json({
                        status: "success",
                        data,
                    });
                }
            })
            .catch(() => {
                return next(appError(400, "新增失敗", next));
            });
    },
    postUrlAddNewPost: async (req, res, next) => {
        const properties = ['user', 'tags', 'type', 'image', 'content'];
        const obj = req.body;
        const keys_1 = Object.keys(obj);
        // obj.image = req.imgFile.link;
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
                    return next(appError(400, "欄位未填寫正確", next));
                    // res.status(400).json({
                    //     status: 'false',
                    //     message: "欄位未填寫正確"
                    // });
                } else {
                    res.status(200).json({
                        status: "success",
                        data,
                    });
                }
            })
            .catch(() => {
                // res.status(200).json({
                //     status: 'false',
                //     message: '新增失敗',
                // })
                return next(appError(400, "新增失敗", next));
            });
    },
    patchPost: async (req, res, next) => {
        const obj = req.body;
        const keys_1 = Object.keys(obj);
        // const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
        const properties = ['user', 'tags', 'type', 'image', 'content', 'likes', 'whoLikes', 'comments'];
        var resObj = obj;
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
                    // res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });
                    return next(appError(400, "欄位未填寫正確", next));
                } else {
                    res.status(200).json({
                        status: 'success',
                        data: '更新成功',
                    })
                }
            })
            .catch(() => {
                return next(appError(400, "更新失敗", next));
            });
    },
    deleteAll: async (req, res, next) => {
        postModel.deleteMany({}, () => {
            res.status(200).json({
                status: 'success',
                data: '刪除成功',
            })
        });
    },
    deletePostByPostId: async (req, res, next) => {
        const id = req.params.id;
        const post = await postModel.findOne({
            _id: id
        });
        // 刪除commentDetail的紀錄
        await post.commentDetail.forEach(async (commentId) => {
            await commentDetailModel.findByIdAndDelete(commentId).then((result) => {
                console.log(result);
            }).catch((err) => {
                throw new Error('Delete commentDetail fail');
            })
        });

        // 刪除user端的likePosts記錄
        const postObjectId = mongoose.Types.ObjectId(id);
        await post.whoLikes.forEach(async (userId) => {
            const user = await userModel.findOne({
                _id: userId
            });
            user.likePosts = await user.likePosts.filter(likePostId => !likePostId.equals(postObjectId));
            await user.save();
        });

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
                return next(appError(400, "刪除失敗", next));
            });
    }
}


module.exports = posts;