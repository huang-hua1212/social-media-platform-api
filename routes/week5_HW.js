var express = require('express');
var router = express.Router();
var appError = require('../services/appError');


router.post('/error', async(req, res, next)=>{
    if(req.body.content ==undefined) {
        return next(appError(400, "你沒有填寫contetent", next));
    }
    res.status(200).json({
        status: 'success',
        message: '新增成功!'
    });
})

module.exports = router;