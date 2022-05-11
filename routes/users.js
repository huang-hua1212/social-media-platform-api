var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/user');
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
router.get('/user/:id', function (req, res, next) {
  const id = req.params.id;

  userModel.findById(id).populate({
    path: 'followings',
    select: '_id user whoFollow createdAt updateAt',
    populate: {
      path: 'user',
      select: 'name photo'
    }
  }).exec(function (err, datas) {
    // console.log(datas);
    if (datas) {
      res.status(200).json({
        status: 'success',
        datas,
      });
    } else {
      res.status(400).json({
        status: 'false',
        message: "欄位未填寫正確，或無此 ID",
      });
    }
  });
});


/* patch users listing. with url image */
router.patch('/user/:id', async function (req, res, next) {
  const obj = req.body;
  console.log(obj);
  const keys_1 = Object.keys(obj);
  // const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
  const properties = ['name', 'username', 'password', 'role', 'sex', 'photo', 'followings', 'tokens'];
  var resObj = obj;
  const id = req.params.id;
  // // 加密
  if (resObj.password !== "" && resObj.password !== undefined) {
    resObj.password = await bcrypt.hash(resObj.password, 8)
  }
  userModel.findByIdAndUpdate(id, resObj)
    .then(async (result) => {
      var fail = 0;
      if (!result) {
        throw new Error(false);
      }
      keys_1.forEach((value) => {

        if (properties.indexOf(value) === -1) {
          fail += 1;
        }
        resObj[value] = obj[value];
      })



      if (fail > 0) {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });

      } else {
        res.status(200).json({
          status: 'success',
          data: '更新成功',
        })
      }
    })
    .catch(() => {
      res.status(400).json({
        status: 'false',
        data: '更新失敗或無此ID',
      })
    });
});


/* GET users listing. with url image */
router.patch('/user-with-FormDataImage/:id', uploadMulter.single('photo'), refreshToken, uploadImg, function (req, res, next) {
  const obj = req.body;
  const keys_1 = Object.keys(obj);
  // const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
  const properties = ['name', 'username', 'password', 'role', 'sex', 'photo', 'followings', 'tokens'];
  obj.photo = req.imgFile.link;
  var resObj = obj;
  const id = req.params.id;
  userModel.findByIdAndUpdate(id, resObj)
    .then((result) => {
      var fail = 0;
      if (!result) {
        throw new Error(false);
      }
      keys_1.forEach((value) => {
        console.log(value);
        if (properties.indexOf(value) === -1) {
          fail += 1;
        }
        resObj[value] = obj[value];
      })
      if (fail > 0) {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });

      } else {
        res.status(200).json({
          status: 'success',
          data: '更新成功',
        })
      }
    })
    .catch(() => {
      res.status(400).json({
        status: 'false',
        data: '更新失敗或無此ID',
      })
    });
});

module.exports = router;
