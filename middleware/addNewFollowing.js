
const followingModel = require('../models/following');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });




function addNewFollowing(req, res, next) {
    const obj = req.body;
    followingModel.create(obj).then((data) => {
        const user_Id=data._id.toString();
        req.followingsUserId=user_Id;
        next();
    }).catch(() => {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
    });
}

module.exports=addNewFollowing
