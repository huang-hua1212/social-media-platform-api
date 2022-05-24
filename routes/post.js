var express = require("express");
var router = express.Router();
const dotenv = require('dotenv');
const postController = require('../controller/posts');
dotenv.config({
    path: './.env'
});
// Temp
const refreshToken = require('../middleware/file/imgur/refreshToken');
const uploadImg = require('../middleware/file/imgur/upload');
var multer = require('multer');
var uploadMulter = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true)
            return
        } else {
            cb(null, false)
            return cb(new Error('Allowed only .png, .jpg, .jpeg'))
        }
    }
})


//get all
router.get('', async (req, res) => {
    postController.getAll(req, res);
});


// get by postId
router.get('/:id', (req, res, next) => {
    postController.getPostByPostId(req, res);
});


// get by userId
router.get('/by-userId/:id', (req, res, next) => {
    postController.getPostByUserId(req, res);
});


// get by userId with regex content
router.post('/by-userId/:id', (req, res, next) => {
    postController.postRegexContentSearchPostUnderPosId(req, res);
});


// get by regex content
router.post('/by-content', (req, res) => {
    postController.postRegexContentSearchPost(req, res);
})


// post_2 with Image Imgur Process
router.post('/with-FormDataImage', uploadMulter.single('image'), refreshToken, uploadImg, (req, res, next) => {
    postController.postFormDataAddNewPost(req, res);
});


// post_3 with Image Imgur Process
router.post('/with-UrlImage', (req, res) => {
    postController.postUrlAddNewPost(req, res);
});


// patch
router.patch('/:id', (req, res) => {
    postController.patchPost(req, res);
})


// delete all
router.delete('', (req, res) => {
    postController.deleteAll(req, res);
})


// delete id
router.delete('/:id', async (req, res) => {
    postController.deletePostByPostId(req, res);
})



module.exports = router