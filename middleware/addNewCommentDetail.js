
const commentDetailModel = require('../models/commentDetail');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });




function addNewCommentDetail(req, res, next) {
    const obj = req.body;
    commentDetailModel.create(obj).then(data => {
        console.log(data);
        const user_Id = data._id.toString();
        req.commentDetailId = user_Id;
        next();
    }).catch(() => {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
    })
}



module.exports = addNewCommentDetail;