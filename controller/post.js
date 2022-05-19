var multer = require('multer');

const posts = {
    getAll: (req, res) => {
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
    }
}


module.exports = posts;