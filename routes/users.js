var express = require('express');
var router = express.Router();
// const bcrypt = require('bcryptjs')
// const userModel = require('../models/user');
const usersController= require('../controller/users');
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



/* GET users BY id */
router.get('/:id', (req, res, next) => {
  usersController.getUserByUserId(req, res, next);
});


/* patch users listing. with url image */
router.patch('/:id', (req, res, next) => {
  usersController.patchUserWithUrlImg(req, res, next);
});


/* GET users listing. with FormData image */
router.patch('/with-FormDataImage/:id', uploadMulter.single('photo'), refreshToken, uploadImg, (req, res, next) =>{
  postsController.patchUserWithFormDataImg(req, res, next);
  // const obj = req.body;
  // const keys_1 = Object.keys(obj);
  // const properties = ['name', 'username', 'password', 'role', 'sex', 'photo', 'followings', 'tokens'];
  // obj.photo = req.imgFile.link;
  // var resObj = obj;
  // const id = req.params.id;
  // userModel.findByIdAndUpdate(id, resObj)
  //   .then((result) => {
  //     var fail = 0;
  //     if (!result) {
  //       throw new Error(false);
  //     }
  //     keys_1.forEach((value) => {
  //       console.log(value);
  //       if (properties.indexOf(value) === -1) {
  //         fail += 1;
  //       }
  //       resObj[value] = obj[value];
  //     })
  //     if (fail > 0) {
  //       res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });

  //     } else {
  //       res.status(200).json({
  //         status: 'success',
  //         data: '更新成功',
  //       })
  //     }
  //   })
  //   .catch(() => {
  //     res.status(400).json({
  //       status: 'false',
  //       data: '更新失敗或無此ID',
  //     })
  //   });
});

module.exports = router;
