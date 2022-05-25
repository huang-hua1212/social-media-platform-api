var express = require("express");
var router = express.Router();
const postsController = require('../controller/posts');
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
router.get('', async (req, res, next) => {
    postsController.getAll(req, res, next);
});


// get by postId
router.get('/:id', (req, res, next) => {
    postsController.getPostByPostId(req, res, next);
});


// get by userId
router.get('/by-userId/:id', (req, res, next) => {
    postsController.getPostByUserId(req, res, next);
});


// get by userId with regex content
router.post('/by-userId/:id', (req, res, next) => {
    postsController.postRegexContentSearchPostUnderPosId(req, res, next);
});


// get by regex content
router.post('/by-content', (req, res) => {
    postsController.postRegexContentSearchPost(req, res, next);
})


// post_2 with Image Imgur Process
router.post('/with-FormDataImage', uploadMulter.single('image'), refreshToken, uploadImg, (req, res, next) => {
    postsController.postFormDataAddNewPost(req, res, next);
});


// post_3 with Image Imgur Process
router.post('/with-UrlImage', (req, res, next) => {
    postsController.postUrlAddNewPost(req, res, next);
});


// patch
router.patch('/:id', (req, res, next) => {
    postsController.patchPost(req, res, next);
})


// delete all
router.delete('', (req, res, next) => {
    postsController.deleteAll(req, res, next);
})


// delete id
router.delete('/:id', async (req, res, next) => {
    postsController.deletePostByPostId(req, res, next);
})



module.exports = router