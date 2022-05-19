var express = require('express');
var router = express.Router();
var uploadImg = require('../middleware/file/imgur/upload');

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

router.post('/uploadImg', uploadMulter.single('image'), uploadImg, (req, res) => {
    try {
        const data = req.imgFile;
        res.status(200).json({ status: 'success', data });
    } catch {
        res.status(400).json({ status: 'false', message: '欄位未填寫正確' });
    }
});


module.exports = router;