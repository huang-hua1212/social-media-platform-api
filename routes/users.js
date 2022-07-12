const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs')
// const userModel = require('../models/user');
const usersController= require('../controller/users');
// Temp
const refreshToken = require('../middleware/file/imgur/refreshToken');
const uploadImg = require('../middleware/file/imgur/upload');
const multer = require('multer');
const uploadMulter = multer({
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


/* GET users BY id */
router.get('/:id', (req, res, next) => {
  usersController.getUserByUserId(req, res, next);
});


/* patch users listing. with url image */
router.patch('/:id', (req, res, next) => {
  usersController.patchUserWithUrlImg(req, res, next);
});


/* update users listing. with FormData image */
router.patch('/with-FormDataImage/:id', uploadMulter.single('photo'), refreshToken, uploadImg, (req, res, next) =>{
  usersController.patchUserWithFormDataImg(req, res, next);
});

/* sign up */
router.post('/sign_up', (req, res, next) =>{
  usersController.sign_up(req, res, next);
});

/* sign in */
router.post('/sign_in', (req, res, next) =>{
  usersController.sign_in(req, res, next);
});

module.exports = router;
