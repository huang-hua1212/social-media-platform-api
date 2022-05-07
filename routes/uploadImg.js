var express = require('express');
var router = express.Router();
var uploadImg = require('../middleware/file/imgur/upload');
// var uploadImgTest = require('../middleware/uploadTest');

var multer = require('multer');
var uploadMulter = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png") {
            cb(null, true)
            return
        } else {
            cb(null, false)
            return cb(new Error('Allowed only .png'))
        }
    }
})

router.post('/uploadImg', uploadMulter.single('file'), uploadImg, (req, res) => {
    console.log(req.imgFile);
    res.status(200).json({ status: 'success', data: "欄位未填寫正確，或無此 todo ID" });
});


module.exports = router;